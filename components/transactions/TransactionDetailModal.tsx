import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TransactionSelect } from '@/db/schema/transactions';
import { TransactionItemSelect } from '@/db/schema/transaction-items';
import { getTransactionItems } from '@/db/repositories/transaction-repository';
import { formatCents } from '@/utils/money';

interface TransactionDetailModalProps {
  visible: boolean;
  transaction: TransactionSelect | null;
  currencySymbol: string;
  onClose: () => void;
  onPrint?: (items: TransactionItemSelect[]) => void;
}

export const TransactionDetailModal = ({
  visible,
  transaction,
  currencySymbol,
  onClose,
  onPrint,
}: TransactionDetailModalProps) => {
  const [items, setItems] = useState<TransactionItemSelect[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && transaction) {
      setLoading(true);
      void getTransactionItems(transaction.id)
        .then((res) => setItems(res))
        .finally(() => setLoading(false));
    }
  }, [visible, transaction]);

  if (!visible || !transaction) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={detailStyles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={detailStyles.container}>
              <View style={detailStyles.header}>
                <View>
                  <Text style={detailStyles.title}>{transaction.invoiceNumber}</Text>
                  <Text style={detailStyles.subtitle}>
                    {new Date(transaction.createdAt).toLocaleString()}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose}>
                  <MaterialIcons name="close" size={24} color="#737686" />
                </TouchableOpacity>
              </View>

              <View style={detailStyles.infoCard}>
                <View style={detailStyles.infoRow}>
                  <Text style={detailStyles.infoLabel}>Payment Method</Text>
                  <Text style={detailStyles.infoValue}>{transaction.paymentMethod}</Text>
                </View>
                <View style={detailStyles.infoRow}>
                  <Text style={detailStyles.infoLabel}>Status</Text>
                  <Text style={detailStyles.infoValue}>{transaction.paymentStatus}</Text>
                </View>
                {transaction.customerName && (
                  <View style={detailStyles.infoRow}>
                    <Text style={detailStyles.infoLabel}>Customer</Text>
                    <Text style={detailStyles.infoValue}>{transaction.customerName}</Text>
                  </View>
                )}
              </View>

              <Text style={detailStyles.sectionTitle}>Items</Text>

              {loading ? (
                <ActivityIndicator style={{ paddingVertical: 20 }} color="#004fe6" />
              ) : (
                <ScrollView style={detailStyles.itemsList}>
                  {items.map((item) => (
                    <View key={item.id} style={detailStyles.itemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={detailStyles.itemName}>{item.productName}</Text>
                        <Text style={detailStyles.itemQtyPrice}>
                          {item.quantity} x {formatCents(item.priceCents, currencySymbol)}
                        </Text>
                      </View>
                      <Text style={detailStyles.itemTotal}>
                        {formatCents(item.totalCents, currencySymbol)}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              )}

              <View style={detailStyles.summaryFooter}>
                <View style={detailStyles.summaryRow}>
                  <Text style={detailStyles.summaryLabel}>Subtotal</Text>
                  <Text style={detailStyles.summaryValue}>
                    {formatCents(transaction.subtotalCents, currencySymbol)}
                  </Text>
                </View>
                {transaction.discountCents > 0 && (
                  <View style={detailStyles.summaryRow}>
                    <Text style={detailStyles.summaryLabel}>Discount</Text>
                    <Text style={[detailStyles.summaryValue, { color: '#ba1a1a' }]}>
                      -{formatCents(transaction.discountCents, currencySymbol)}
                    </Text>
                  </View>
                )}
                {transaction.taxCents > 0 && (
                  <View style={detailStyles.summaryRow}>
                    <Text style={detailStyles.summaryLabel}>Tax</Text>
                    <Text style={detailStyles.summaryValue}>
                      {formatCents(transaction.taxCents, currencySymbol)}
                    </Text>
                  </View>
                )}
                <View style={[detailStyles.summaryRow, { marginTop: 4, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#eef0fa' }]}>
                  <Text style={[detailStyles.summaryLabel, { fontWeight: '700', fontSize: 16, color: '#131b2e' }]}>Total</Text>
                  <Text style={[detailStyles.summaryValue, { fontWeight: '800', fontSize: 18, color: '#004fe6' }]}>
                    {formatCents(transaction.totalCents, currencySymbol)}
                  </Text>
                </View>

                {onPrint && (
                  <TouchableOpacity
                    style={detailStyles.printBtn}
                    activeOpacity={0.8}
                    onPress={() => onPrint(items)}
                  >
                    <MaterialIcons name="print" size={20} color="#ffffff" />
                    <Text style={detailStyles.printBtnText}>Print Receipt</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const detailStyles = StyleSheet.create({
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131b2e',
  },
  subtitle: {
    fontSize: 12,
    color: '#737686',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    padding: 12,
    gap: 6,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 12,
    color: '#737686',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#131b2e',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#131b2e',
    marginBottom: 8,
  },
  itemsList: {
    maxHeight: 180,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f3ff',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#131b2e',
  },
  itemQtyPrice: {
    fontSize: 11,
    color: '#737686',
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#131b2e',
  },
  summaryFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eef0fa',
    paddingTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#737686',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#131b2e',
  },
  printBtn: {
    backgroundColor: '#004fe6',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  printBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
