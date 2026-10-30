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
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  desc: string;
}[] = [
  { id: 'CASH', label: 'Cash', icon: 'payments', desc: 'Cash payment' },
  { id: 'UPI', label: 'UPI / QR', icon: 'qr-code-scanner', desc: 'Instant QR' },
  { id: 'CARD', label: 'Card POS', icon: 'credit-card', desc: 'Debit / Credit' },
  { id: 'CREDIT', label: 'Khata Book', icon: 'account-balance-wallet', desc: 'Credit ledger' },
];

export const PaymentModal = ({
  visible,
  isProcessing,
  onClose,
  onConfirm,
}: PaymentModalProps) => {
  const router = useRouter();
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
              <Text style={paymentStyles.paymentModalTitle}>Complete Payment</Text>
              <Text style={paymentStyles.paymentModalSubtitle}>
                {totals.totalItemsCount} items · Cart Subtotal {formatCents(totals.subtotalCents, currencySymbol)}
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
                <Text style={paymentStyles.payableHeroLabel}>Total Payable</Text>
                <Text style={paymentStyles.payableHeroSub}>Includes all GST & discounts</Text>
              </View>
              <Text style={paymentStyles.payableHeroAmount}>
                {formatCents(totals.totalCents, currencySymbol)}
              </Text>
            </View>

            <Text style={paymentStyles.paymentSectionHeader}>Select Payment Mode</Text>
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
                      {method.label}
                    </Text>
                    <Text style={paymentStyles.paymentCardDesc}>{method.desc}</Text>
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
                      Instant UPI Collection
                    </Text>
                    <Text style={{ fontSize: 12, color: '#0284c7' }}>
                      Customer can scan your store QR code or soundbox. Verify transaction before confirming.
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
                      Card Terminal Payment
                    </Text>
                    <Text style={{ fontSize: 12, color: '#7c3aed' }}>
                      Swipe, insert chip, or tap customer card on EDC machine.
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
                    Khata / Credit Sale
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: '#92400e', marginBottom: 10, lineHeight: 16 }}>
                  {"This amount will be added as outstanding debt in customer's ledger."}
                </Text>

                {customers.length > 0 && (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 11.5, fontWeight: '600', color: '#92400e', marginBottom: 6 }}>
                      Quick Pick Existing Customer:
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
                                Due {formatCents(c.creditBalanceCents, currencySymbol)}
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
                  <Text style={paymentStyles.openKhataButtonText}>Open Customer Ledger & Khata Book</Text>
                  <MaterialIcons name="chevron-right" size={16} color="#004ac6" />
                </TouchableOpacity>
              </View>
            )}

            <View style={paymentStyles.customerFormCard}>
              <View style={paymentStyles.customerFormHeader}>
                <MaterialIcons name="person-outline" size={18} color="#004ac6" />
                <Text style={paymentStyles.customerFormTitle}>
                  Customer Details {isCredit ? '(Required *)' : '(Optional for Bill)'}
                </Text>
              </View>

              <View style={paymentStyles.customerFieldGroup}>
                <Text style={paymentStyles.customerFieldLabel}>Customer Name {isCredit ? '*' : ''}</Text>
                <View style={paymentStyles.customerInputWrap}>
                  <MaterialIcons name="person" size={16} color="#94a3b8" style={{ marginRight: 8 }} />
                  <TextInput
                    style={paymentStyles.customerInput}
                    placeholder="Enter customer full name"
                    placeholderTextColor="#94a3b8"
                    value={customerName}
                    onChangeText={setCustomerName}
                  />
                </View>
              </View>

              <View style={paymentStyles.customerFieldGroup}>
                <Text style={paymentStyles.customerFieldLabel}>Mobile Number (Optional)</Text>
                <View style={paymentStyles.customerInputWrap}>
                  <MaterialIcons name="phone" size={16} color="#94a3b8" style={{ marginRight: 8 }} />
                  <TextInput
                    style={paymentStyles.customerInput}
                    placeholder="Enter customer phone number"
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
                ? 'Generating Bill...'
                : isCredit
                ? `Confirm Khata Bill (${formatCents(totals.totalCents, currencySymbol)})`
                : `Confirm & Print Bill (${formatCents(totals.totalCents, currencySymbol)})`}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
