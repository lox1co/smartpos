import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useCart } from '@/hooks/use-cart';
import { CartItemRow } from './CartItemRow';
import { formatCents } from '@/utils/money';
import { styles } from './billing.styles';

interface CartBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onCheckoutPress: () => void;
}

export const CartBottomSheet = ({
  visible,
  onClose,
  onCheckoutPress,
}: CartBottomSheetProps) => {
  const {
    items,
    totals,
    currencySymbol,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.sheetBackdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHandle} />

              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Current Order ({totals.totalItemsCount})</Text>
                {items.length > 0 && (
                  <TouchableOpacity onPress={clearCart}>
                    <Text style={styles.clearCartText}>Clear All</Text>
                  </TouchableOpacity>
                )}
              </View>

              <ScrollView style={styles.cartItemsList} showsVerticalScrollIndicator={false}>
                {items.length === 0 ? (
                  <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                    <Text style={{ color: '#737686', fontSize: 14 }}>Your cart is empty</Text>
                  </View>
                ) : (
                  items.map((item) => (
                    <CartItemRow
                      key={item.product.id}
                      item={item}
                      currencySymbol={currencySymbol}
                      onIncrease={() => updateQuantity(item.product.id, item.quantity + 1)}
                      onDecrease={() => updateQuantity(item.product.id, item.quantity - 1)}
                      onRemove={() => removeItem(item.product.id)}
                    />
                  ))
                )}
              </ScrollView>

              {items.length > 0 && (
                <View style={styles.sheetFooter}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>
                      {formatCents(totals.subtotalCents, currencySymbol)}
                    </Text>
                  </View>

                  {totals.discountCents > 0 && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Discount</Text>
                      <Text style={[styles.summaryValue, { color: '#ba1a1a' }]}>
                        -{formatCents(totals.discountCents, currencySymbol)}
                      </Text>
                    </View>
                  )}

                  {totals.taxCents > 0 && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Tax</Text>
                      <Text style={styles.summaryValue}>
                        {formatCents(totals.taxCents, currencySymbol)}
                      </Text>
                    </View>
                  )}

                  <View style={[styles.summaryRow, { marginTop: 4, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#eef0fa' }]}>
                    <Text style={[styles.summaryLabel, { fontWeight: '700', fontSize: 16, color: '#131b2e' }]}>Total</Text>
                    <Text style={[styles.summaryValue, { fontWeight: '700', fontSize: 18, color: '#004fe6' }]}>
                      {formatCents(totals.totalCents, currencySymbol)}
                    </Text>
                  </View>

                  <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.8} onPress={onCheckoutPress}>
                    <Text style={styles.checkoutBtnText}>Proceed to Payment</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
