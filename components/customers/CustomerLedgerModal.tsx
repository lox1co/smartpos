import React, { useState, useEffect } from 'react';
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
import { MaterialIcons } from '@expo/vector-icons';
import { CustomerSelect } from '@/db/schema/customers';
import { CreditEntrySelect } from '@/db/schema/credit-entries';
import { getCustomerCreditEntries } from '@/db/repositories/customer-repository';
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
  const [entries, setEntries] = useState<CreditEntrySelect[]>([]);
  const [loading, setLoading] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payNote, setPayNote] = useState('');
  const [recording, setRecording] = useState(false);
  const [showPayInput, setShowPayInput] = useState(false);

  useEffect(() => {
    if (visible && customer) {
      setLoading(true);
      void getCustomerCreditEntries(customer.id)
        .then((data) => setEntries(data))
        .finally(() => setLoading(false));
    }
  }, [visible, customer]);

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
                <Text style={ledgerStyles.balanceLabel}>Current Outstanding Balance</Text>
                <Text style={ledgerStyles.balanceAmount}>
                  {formatCents(customer.creditBalanceCents, currencySymbol)}
                </Text>
              </View>

              <Text style={ledgerStyles.sectionTitle}>Transaction Ledger</Text>

              {loading ? (
                <ActivityIndicator style={{ paddingVertical: 20 }} color="#004fe6" />
              ) : (
                <ScrollView style={ledgerStyles.entriesList}>
                  {entries.length === 0 ? (
                    <Text style={ledgerStyles.emptyListText}>No credit entries recorded</Text>
                  ) : (
                    entries.map((e) => {
                      const isCredit = e.entryType === 'CREDIT';
                      return (
                        <View key={e.id} style={ledgerStyles.entryRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={ledgerStyles.entryType}>
                              {isCredit ? 'Payment / Repayment' : 'Bought on Credit'}
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
                    placeholder="Payment Amount (e.g. 50.00)"
                    keyboardType="numeric"
                    value={payAmount}
                    onChangeText={setPayAmount}
                  />
                  <TextInput
                    style={ledgerStyles.payInput}
                    placeholder="Note (optional)"
                    value={payNote}
                    onChangeText={setPayNote}
                  />
                  <View style={ledgerStyles.payBtnRow}>
                    <TouchableOpacity
                      style={ledgerStyles.cancelPayBtn}
                      onPress={() => setShowPayInput(false)}
                    >
                      <Text style={ledgerStyles.cancelPayText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[ledgerStyles.submitPayBtn, recording && { opacity: 0.6 }]}
                      disabled={recording}
                      onPress={handlePayment}
                    >
                      <Text style={ledgerStyles.submitPayText}>
                        {recording ? 'Recording...' : 'Record Payment'}
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
                  <Text style={ledgerStyles.recordBtnText}>Record Repayment</Text>
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
