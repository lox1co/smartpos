import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '@/hooks/use-cart';
import { formatCents, toCents } from '@/utils/money';

type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'CREDIT';

interface PaymentModalProps {
  visible: boolean;
  isProcessing: boolean;
  onClose: () => void;
  onConfirm: (method: PaymentMethod, amountPaidCents?: number) => void;
}

const METHODS: { id: PaymentMethod; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { id: 'CASH', label: 'Cash', icon: 'payments' },
  { id: 'UPI', label: 'UPI / QR', icon: 'qr-code-scanner' },
  { id: 'CARD', label: 'Card', icon: 'credit-card' },
  { id: 'CREDIT', label: 'Credit', icon: 'account-balance-wallet' },
];

export const PaymentModal = ({
  visible,
  isProcessing,
  onClose,
  onConfirm,
}: PaymentModalProps) => {
  const { totals, currencySymbol } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('CASH');
  const [cashTenderedInput, setCashTenderedInput] = useState('');

  if (!visible) return null;

  const totalDueCents = totals.totalCents;
  const tenderedCents = cashTenderedInput ? toCents(parseFloat(cashTenderedInput) || 0) : totalDueCents;
  const changeDueCents = Math.max(0, tenderedCents - totalDueCents);

  const handlePay = () => {
    onConfirm(selectedMethod, selectedMethod === 'CASH' ? tenderedCents : undefined);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={modalStyles.container}>
              <View style={modalStyles.header}>
                <Text style={modalStyles.title}>Select Payment Method</Text>
                <TouchableOpacity onPress={onClose}>
                  <MaterialIcons name="close" size={24} color="#737686" />
                </TouchableOpacity>
              </View>

              <View style={modalStyles.totalBadge}>
                <Text style={modalStyles.totalDueLabel}>Amount Due</Text>
                <Text style={modalStyles.totalDueAmount}>
                  {formatCents(totalDueCents, currencySymbol)}
                </Text>
              </View>

              <View style={modalStyles.methodGrid}>
                {METHODS.map((m) => {
                  const isSelected = selectedMethod === m.id;
                  return (
                    <TouchableOpacity
                      key={m.id}
                      style={[modalStyles.methodCard, isSelected && modalStyles.methodCardSelected]}
                      onPress={() => setSelectedMethod(m.id)}
                    >
                      <MaterialIcons
                        name={m.icon}
                        size={28}
                        color={isSelected ? '#004fe6' : '#737686'}
                      />
                      <Text style={[modalStyles.methodLabel, isSelected && modalStyles.methodLabelSelected]}>
                        {m.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {selectedMethod === 'CASH' && (
                <View style={modalStyles.cashSection}>
                  <Text style={modalStyles.cashLabel}>Cash Received</Text>
                  <TextInput
                    style={modalStyles.cashInput}
                    keyboardType="numeric"
                    placeholder={(totalDueCents / 100).toFixed(2)}
                    value={cashTenderedInput}
                    onChangeText={setCashTenderedInput}
                  />
                  {tenderedCents > totalDueCents && (
                    <View style={modalStyles.changeRow}>
                      <Text style={modalStyles.changeLabel}>Change to return:</Text>
                      <Text style={modalStyles.changeAmount}>
                        {formatCents(changeDueCents, currencySymbol)}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <TouchableOpacity
                style={[modalStyles.confirmBtn, isProcessing && { opacity: 0.7 }]}
                disabled={isProcessing}
                onPress={handlePay}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={modalStyles.confirmText}>
                    Complete Sale ({formatCents(totalDueCents, currencySymbol)})
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 420,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131b2e',
  },
  totalBadge: {
    backgroundColor: '#eef0fa',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  totalDueLabel: {
    fontSize: 12,
    color: '#737686',
    fontWeight: '600',
  },
  totalDueAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#004fe6',
    marginTop: 2,
  },
  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  methodCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9ff',
    borderWidth: 1.5,
    borderColor: '#eef0fa',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  methodCardSelected: {
    borderColor: '#004fe6',
    backgroundColor: '#f0f5ff',
  },
  methodLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#434655',
  },
  methodLabelSelected: {
    color: '#004fe6',
  },
  cashSection: {
    marginBottom: 16,
  },
  cashLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#434655',
    marginBottom: 6,
  },
  cashInput: {
    backgroundColor: '#f8f9ff',
    borderWidth: 1,
    borderColor: '#c3c6d7',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 16,
    fontWeight: '700',
    color: '#131b2e',
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  changeLabel: {
    fontSize: 13,
    color: '#737686',
  },
  changeAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e7b34',
  },
  confirmBtn: {
    backgroundColor: '#004fe6',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
