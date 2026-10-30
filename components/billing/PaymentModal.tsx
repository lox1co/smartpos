import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '@/hooks/use-cart';
import { useCustomers } from '@/hooks/use-customers';
import { formatCents } from '@/utils/money';
import { paymentStyles } from './payment-modal.styles';

export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'CREDIT';

export interface PaymentConfirmOptions {
  customerName?: string;
  customerPhone?: string;
  amountPaidCents?: number;
}

interface PaymentModalProps {
  visible: boolean;
  isProcessing: boolean;
  onClose: () => void;
  onConfirm: (method: PaymentMethod, options?: PaymentConfirmOptions) => void;
}

const PAYMENT_METHODS: {
  id: PaymentMethod;
  labelKey: 'cash' | 'upi' | 'card' | 'credit';
  descKey: 'cashDesc' | 'upiDesc' | 'cardDesc' | 'creditDesc';
  icon: keyof typeof MaterialIcons.glyphMap;
}[] = [
  { id: 'CASH', labelKey: 'cash', descKey: 'cashDesc', icon: 'payments' },
  { id: 'UPI', labelKey: 'upi', descKey: 'upiDesc', icon: 'qr-code-scanner' },
  { id: 'CARD', labelKey: 'card', descKey: 'cardDesc', icon: 'credit-card' },
  { id: 'CREDIT', labelKey: 'credit', descKey: 'creditDesc', icon: 'account-balance-wallet' },
];

export const PaymentModal = ({
  visible,
  isProcessing,
  onClose,
  onConfirm,
}: PaymentModalProps) => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'billing']);
  const { totals, currencySymbol } = useCart();
  const { customers } = useCustomers();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('CASH');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  if (!visible) return null;

  const isCredit = selectedMethod === 'CREDIT';
  const paymentBlocked = isProcessing || (isCredit && customerName.trim().length === 0);

  const handleConfirm = () => {
    onConfirm(selectedMethod, {
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={paymentStyles.paymentModalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={paymentStyles.paymentModalContainer}
        >
          <View style={paymentStyles.modalHandle} />

          <View style={paymentStyles.paymentModalHeader}>
            <View>
              <Text style={paymentStyles.paymentModalTitle}>{t('billing:payment.title')}</Text>
              <Text style={paymentStyles.paymentModalSubtitle}>
                {t('billing:payment.subtitle', {
                  count: totals.totalItemsCount,
                  amount: formatCents(totals.subtotalCents, currencySymbol),
                })}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={paymentStyles.modalCloseBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={paymentStyles.payableHeroCard}>
              <View style={paymentStyles.payableHeroLeft}>
                <Text style={paymentStyles.payableHeroLabel}>{t('billing:payment.totalPayable')}</Text>
                <Text style={paymentStyles.payableHeroSub}>{t('billing:payment.includesTax')}</Text>
              </View>
              <Text style={paymentStyles.payableHeroAmount}>
                {formatCents(totals.totalCents, currencySymbol)}
              </Text>
            </View>

            <Text style={paymentStyles.paymentSectionHeader}>{t('billing:payment.selectMode')}</Text>
            <View style={paymentStyles.paymentGrid}>
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      paymentStyles.paymentGridCard,
                      isSelected && paymentStyles.paymentGridCardSelected,
                    ]}
                    onPress={() => setSelectedMethod(method.id)}
                    activeOpacity={0.8}
                  >
                    <View style={paymentStyles.paymentCardTopRow}>
                      <View
                        style={[
                          paymentStyles.paymentCardIconWrap,
                          isSelected && paymentStyles.paymentCardIconWrapSelected,
                        ]}
                      >
                        <MaterialIcons
                          name={method.icon}
                          size={22}
                          color={isSelected ? '#004ac6' : '#64748b'}
                        />
                      </View>
                      {isSelected && (
                        <MaterialIcons name="check-circle" size={18} color="#004ac6" />
                      )}
                    </View>
                    <Text
                      style={[
                        paymentStyles.paymentCardTitle,
                        isSelected && paymentStyles.paymentCardTitleSelected,
                      ]}
                    >
                      {t(`billing:payment.methods.${method.labelKey}`)}
                    </Text>
                    <Text style={paymentStyles.paymentCardDesc}>
                      {t(`billing:payment.methods.${method.descKey}`)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedMethod === 'UPI' && (
              <View style={[paymentStyles.modeHelperCard, { backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <MaterialIcons name="qr-code" size={24} color="#0284c7" />
                  <View style={{ flex: 1 }}>
                    <Text style={[paymentStyles.helperCardTitle, { color: '#0369a1', marginBottom: 2 }]}>
                      {t('billing:payment.upiTitle')}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#0284c7' }}>
                      {t('billing:payment.upiDesc')}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {selectedMethod === 'CARD' && (
              <View style={[paymentStyles.modeHelperCard, { backgroundColor: '#f5f3ff', borderColor: '#ddd6fe' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <MaterialIcons name="credit-card" size={24} color="#7c3aed" />
                  <View style={{ flex: 1 }}>
                    <Text style={[paymentStyles.helperCardTitle, { color: '#6d28d9', marginBottom: 2 }]}>
                      {t('billing:payment.cardTitle')}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#7c3aed' }}>
                      {t('billing:payment.cardDesc')}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {selectedMethod === 'CREDIT' && (
              <View style={[paymentStyles.modeHelperCard, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <MaterialIcons name="account-balance-wallet" size={20} color="#b45309" />
                  <Text style={[paymentStyles.helperCardTitle, { color: '#b45309', marginBottom: 0 }]}>
                    {t('billing:payment.creditTitle')}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: '#92400e', marginBottom: 10, lineHeight: 16 }}>
                  {t('billing:payment.creditDesc')}
                </Text>

                {customers.length > 0 && (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 11.5, fontWeight: '600', color: '#92400e', marginBottom: 6 }}>
                      {t('billing:payment.quickPickCustomer')}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                      {customers.map((c) => {
                        const active = customerName.trim() === c.name;
                        return (
                          <TouchableOpacity
                            key={c.id}
                            style={[paymentStyles.customerChip, active && paymentStyles.customerChipActive]}
                            onPress={() => {
                              setCustomerName(c.name);
                              setCustomerPhone(c.phone || '');
                            }}
                          >
                            <Text
                              style={[
                                paymentStyles.customerChipText,
                                active && { color: '#004ac6', fontWeight: '700' },
                              ]}
                              numberOfLines={1}
                            >
                              {c.name}
                            </Text>
                            {c.creditBalanceCents > 0 && (
                              <Text style={paymentStyles.customerChipBalance}>
                                {t('billing:payment.due', {
                                  amount: formatCents(c.creditBalanceCents, currencySymbol),
                                })}
                              </Text>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}

                <TouchableOpacity
                  style={paymentStyles.openKhataButton}
                  onPress={() => {
                    onClose();
                    router.push('/customers');
                  }}
                >
                  <MaterialIcons name="people" size={16} color="#004ac6" />
                  <Text style={paymentStyles.openKhataButtonText}>
                    {t('billing:payment.openKhata')}
                  </Text>
                  <MaterialIcons name="chevron-right" size={16} color="#004ac6" />
                </TouchableOpacity>
              </View>
            )}

            <View style={paymentStyles.customerFormCard}>
              <View style={paymentStyles.customerFormHeader}>
                <MaterialIcons name="person-outline" size={18} color="#004ac6" />
                <Text style={paymentStyles.customerFormTitle}>
                  {t('billing:payment.customerDetails')}{' '}
                  {isCredit ? t('billing:payment.required') : t('billing:payment.optional')}
                </Text>
              </View>

              <View style={paymentStyles.customerFieldGroup}>
                <Text style={paymentStyles.customerFieldLabel}>
                  {isCredit
                    ? t('billing:payment.customerNameRequired')
                    : t('billing:payment.customerName')}
                </Text>
                <View style={paymentStyles.customerInputWrap}>
                  <MaterialIcons name="person" size={16} color="#94a3b8" style={{ marginRight: 8 }} />
                  <TextInput
                    style={paymentStyles.customerInput}
                    placeholder={t('billing:payment.enterCustomerName')}
                    placeholderTextColor="#94a3b8"
                    value={customerName}
                    onChangeText={setCustomerName}
                  />
                </View>
              </View>

              <View style={paymentStyles.customerFieldGroup}>
                <Text style={paymentStyles.customerFieldLabel}>
                  {t('billing:payment.customerPhone')}
                </Text>
                <View style={paymentStyles.customerInputWrap}>
                  <MaterialIcons name="phone" size={16} color="#94a3b8" style={{ marginRight: 8 }} />
                  <TextInput
                    style={paymentStyles.customerInput}
                    placeholder={t('billing:payment.enterCustomerPhone')}
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    value={customerPhone}
                    onChangeText={setCustomerPhone}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[
              paymentStyles.confirmPaymentBtn,
              paymentBlocked && paymentStyles.chargeButtonDisabled,
            ]}
            disabled={paymentBlocked}
            onPress={handleConfirm}
            activeOpacity={0.85}
          >
            <MaterialIcons name="receipt-long" size={22} color="#ffffff" />
            <Text style={paymentStyles.confirmPaymentText}>
              {isProcessing
                ? t('billing:payment.generatingBill')
                : isCredit
                ? t('billing:payment.confirmKhataBill', {
                    amount: formatCents(totals.totalCents, currencySymbol),
                  })
                : t('billing:payment.confirmPrintBill', {
                    amount: formatCents(totals.totalCents, currencySymbol),
                  })}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
