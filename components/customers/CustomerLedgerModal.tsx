import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { CustomerSelect } from '@/db/schema/customers';
import { useCustomerCreditEntries } from '@/hooks/use-customers';
import { formatCents, toCents } from '@/utils/money';

interface CustomerLedgerModalProps {
  visible: boolean;
  customer: CustomerSelect | null;
  currencySymbol: string;
  onClose: () => void;
  onRecordPayment: (amountCents: number, note?: string) => Promise<void>;
}

export const CustomerLedgerModal = ({
  visible,
  customer,
  currencySymbol,
  onClose,
  onRecordPayment,
}: CustomerLedgerModalProps) => {
  const { t } = useTranslation(['common', 'customers']);
  const { entries, loading } = useCustomerCreditEntries(customer?.id, visible);
  const [payAmount, setPayAmount] = useState('');
  const [payNote, setPayNote] = useState('');
  const [recording, setRecording] = useState(false);
  const [showPayInput, setShowPayInput] = useState(false);

  if (!visible || !customer) return null;

  const handlePayment = async () => {
    const num = parseFloat(payAmount);
    if (!num || num <= 0) return;
    setRecording(true);
    try {
      await onRecordPayment(toCents(num), payNote.trim() || undefined);
      setPayAmount('');
      setPayNote('');
      setShowPayInput(false);
      onClose();
    } finally {
      setRecording(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={ledgerStyles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={ledgerStyles.container}>
              <View style={ledgerStyles.header}>
                <View>
                  <Text style={ledgerStyles.name}>{customer.name}</Text>
                  {customer.phone && <Text style={ledgerStyles.phone}>{customer.phone}</Text>}
                </View>
                <TouchableOpacity onPress={onClose}>
                  <MaterialIcons name="close" size={24} color="#737686" />
                </TouchableOpacity>
              </View>

              <View style={ledgerStyles.balanceCard}>
                <Text style={ledgerStyles.balanceLabel}>
                  {t('customers:ledgerModal.balanceLabel')}
                </Text>
                <Text style={ledgerStyles.balanceAmount}>
                  {formatCents(customer.creditBalanceCents, currencySymbol)}
                </Text>
              </View>

              <Text style={ledgerStyles.sectionTitle}>
                {t('customers:ledgerModal.sectionTitle')}
              </Text>

              {loading ? (
                <ActivityIndicator style={{ paddingVertical: 20 }} color="#004fe6" />
              ) : (
                <ScrollView style={ledgerStyles.entriesList}>
                  {entries.length === 0 ? (
                    <Text style={ledgerStyles.emptyListText}>
                      {t('customers:ledgerModal.emptyList')}
                    </Text>
                  ) : (
                    entries.map((e) => {
                      const isCredit = e.entryType === 'CREDIT';
                      return (
                        <View key={e.id} style={ledgerStyles.entryRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={ledgerStyles.entryType}>
                              {isCredit
                                ? t('customers:ledgerModal.paymentRepayment')
                                : t('customers:ledgerModal.boughtOnCredit')}
                            </Text>
                            <Text style={ledgerStyles.entryDate}>
                              {new Date(e.createdAt).toLocaleString()}
                            </Text>
                            {e.note && <Text style={ledgerStyles.entryNote}>{e.note}</Text>}
                          </View>
                          <Text
                            style={[
                              ledgerStyles.entryAmount,
                              isCredit ? ledgerStyles.creditText : ledgerStyles.debitText,
                            ]}
                          >
                            {isCredit ? '-' : '+'}
                            {formatCents(e.amountCents, currencySymbol)}
                          </Text>
                        </View>
                      );
                    })
                  )}
                </ScrollView>
              )}

              {showPayInput ? (
                <View style={ledgerStyles.paySection}>
                  <TextInput
                    style={ledgerStyles.payInput}
                    placeholder={t('customers:ledgerModal.payAmountPlaceholder')}
                    keyboardType="numeric"
                    value={payAmount}
                    onChangeText={setPayAmount}
                  />
                  <TextInput
                    style={ledgerStyles.payInput}
                    placeholder={t('customers:ledgerModal.payNotePlaceholder')}
                    value={payNote}
                    onChangeText={setPayNote}
                  />
                  <View style={ledgerStyles.payBtnRow}>
                    <TouchableOpacity
                      style={ledgerStyles.cancelPayBtn}
                      onPress={() => setShowPayInput(false)}
                    >
                      <Text style={ledgerStyles.cancelPayText}>{t('common:actions.cancel')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[ledgerStyles.submitPayBtn, recording && { opacity: 0.6 }]}
                      disabled={recording}
                      onPress={handlePayment}
                    >
                      <Text style={ledgerStyles.submitPayText}>
                        {recording
                          ? t('customers:ledgerModal.recording')
                          : t('customers:ledgerModal.submitPay')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={ledgerStyles.recordBtn}
                  onPress={() => setShowPayInput(true)}
                >
                  <MaterialIcons name="add" size={20} color="#ffffff" />
                  <Text style={ledgerStyles.recordBtnText}>
                    {t('customers:ledgerModal.recordRepayment')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const ledgerStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131b2e',
  },
  phone: {
    fontSize: 13,
    color: '#737686',
    marginTop: 2,
  },
  balanceCard: {
    backgroundColor: '#fff5f5',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ffe0e0',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ba1a1a',
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ba1a1a',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#131b2e',
    marginBottom: 8,
  },
  entriesList: {
    maxHeight: 200,
    marginBottom: 14,
  },
  emptyListText: {
    textAlign: 'center',
    color: '#737686',
    fontSize: 13,
    paddingVertical: 20,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f3ff',
  },
  entryType: {
    fontSize: 13,
    fontWeight: '600',
    color: '#131b2e',
  },
  entryDate: {
    fontSize: 11,
    color: '#737686',
    marginTop: 2,
  },
  entryNote: {
    fontSize: 11,
    color: '#434655',
    fontStyle: 'italic',
    marginTop: 2,
  },
  entryAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  creditText: {
    color: '#2e7d32',
  },
  debitText: {
    color: '#ba1a1a',
  },
  recordBtn: {
    backgroundColor: '#004fe6',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  recordBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  paySection: {
    gap: 8,
    marginTop: 4,
  },
  payInput: {
    backgroundColor: '#f8f9ff',
    borderWidth: 1,
    borderColor: '#c3c6d7',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: '#131b2e',
  },
  payBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  cancelPayBtn: {
    flex: 1,
    backgroundColor: '#eef0fa',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelPayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#434655',
  },
  submitPayBtn: {
    flex: 1,
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitPayText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
