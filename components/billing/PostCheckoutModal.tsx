import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CompletedCheckoutResult } from '@/hooks/use-checkout';
import { formatCents } from '@/utils/money';
import { generateReceiptHtml } from '@/utils/receipt';
import { printHtml, shareHtmlAsPdf } from '@/constants/export';

interface PostCheckoutModalProps {
  visible: boolean;
  result: CompletedCheckoutResult | null;
  currencySymbol: string;
  shopName: string;
  storeAddress?: string;
  storePhone?: string;
  gstNumber?: string;
  onNewSale: () => void;
}

export const PostCheckoutModal = ({
  visible,
  result,
  currencySymbol,
  shopName,
  storeAddress,
  storePhone,
  gstNumber,
  onNewSale,
}: PostCheckoutModalProps) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  if (!visible || !result) return null;

  const { transaction, items } = result;
  const changeDueCents = transaction.changeDueCents ?? 0;
  const hasChange = changeDueCents > 0;

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const html = generateReceiptHtml({
        shopName,
        storeAddress,
        storePhone,
        gstNumber,
        currencySymbol,
        invoiceNumber: transaction.invoiceNumber,
        createdAt: transaction.createdAt,
        paymentMethod: transaction.paymentMethod,
        paymentStatus: transaction.paymentStatus,
        customerName: transaction.customerName || undefined,
        customerPhone: transaction.customerPhone || undefined,
        subtotalCents: transaction.subtotalCents,
        discountCents: transaction.discountCents ?? 0,
        taxCents: transaction.taxCents ?? 0,
        totalCents: transaction.totalCents,
        amountPaidCents: transaction.amountPaidCents || undefined,
        changeDueCents: transaction.changeDueCents || undefined,
        items,
      });
      await printHtml(html);
    } catch {
      Alert.alert('Print Error', 'Could not communicate with the printer.');
    } finally {
      setIsPrinting(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const html = generateReceiptHtml({
        shopName,
        storeAddress,
        storePhone,
        gstNumber,
        currencySymbol,
        invoiceNumber: transaction.invoiceNumber,
        createdAt: transaction.createdAt,
        paymentMethod: transaction.paymentMethod,
        paymentStatus: transaction.paymentStatus,
        customerName: transaction.customerName || undefined,
        customerPhone: transaction.customerPhone || undefined,
        subtotalCents: transaction.subtotalCents,
        discountCents: transaction.discountCents ?? 0,
        taxCents: transaction.taxCents ?? 0,
        totalCents: transaction.totalCents,
        amountPaidCents: transaction.amountPaidCents || undefined,
        changeDueCents: transaction.changeDueCents || undefined,
        items,
      });
      await shareHtmlAsPdf(html, `Receipt-${transaction.invoiceNumber}`);
    } catch {
      Alert.alert('Share Error', 'Could not share receipt.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onNewSale}>
      <TouchableWithoutFeedback onPress={onNewSale}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <View style={styles.successIconWrapper}>
                <MaterialIcons name="check-circle" size={54} color="#16a34a" />
              </View>

              <Text style={styles.title}>Payment Successful</Text>
              <Text style={styles.invoiceText}>{transaction.invoiceNumber}</Text>

              {hasChange && (
                <View style={styles.changeBanner}>
                  <Text style={styles.changeLabel}>CHANGE TO RETURN</Text>
                  <Text style={styles.changeAmount}>
                    {formatCents(changeDueCents, currencySymbol)}
                  </Text>
                </View>
              )}

              <View style={styles.detailsBox}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Amount</Text>
                  <Text style={styles.detailValueBold}>
                    {formatCents(transaction.totalCents, currencySymbol)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Method</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{transaction.paymentMethod}</Text>
                  </View>
                </View>
                {transaction.amountPaidCents !== null && transaction.amountPaidCents !== undefined && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount Tendered</Text>
                    <Text style={styles.detailValue}>
                      {formatCents(transaction.amountPaidCents, currencySymbol)}
                    </Text>
                  </View>
                )}
                {transaction.customerName && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Customer</Text>
                    <Text style={styles.detailValue}>{transaction.customerName}</Text>
                  </View>
                )}
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.actionBtnSecondary}
                  onPress={handlePrint}
                  disabled={isPrinting}
                >
                  {isPrinting ? (
                    <ActivityIndicator size="small" color="#004fe6" />
                  ) : (
                    <>
                      <MaterialIcons name="print" size={18} color="#004fe6" />
                      <Text style={styles.actionBtnSecondaryText}>Print</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtnSecondary}
                  onPress={handleShare}
                  disabled={isSharing}
                >
                  {isSharing ? (
                    <ActivityIndicator size="small" color="#004fe6" />
                  ) : (
                    <>
                      <MaterialIcons name="share" size={18} color="#004fe6" />
                      <Text style={styles.actionBtnSecondaryText}>Share</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.newSaleBtn} onPress={onNewSale}>
                <MaterialIcons name="add-shopping-cart" size={20} color="#ffffff" />
                <Text style={styles.newSaleBtnText}>New Sale</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  successIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  invoiceText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 16,
  },
  changeBanner: {
    width: '100%',
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#86efac',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  changeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
    letterSpacing: 1,
  },
  changeAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#15803d',
    marginTop: 2,
  },
  detailsBox: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginBottom: 18,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  detailValueBold: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  badge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginBottom: 12,
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionBtnSecondaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#004fe6',
  },
  newSaleBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#004fe6',
    paddingVertical: 14,
    borderRadius: 14,
  },
  newSaleBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});
