import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CartItem } from '@/schemas/cart';
import { formatCents } from '@/utils/money';
import { styles } from './billing.styles';

interface CartItemRowProps {
  item: CartItem;
  currencySymbol: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export const CartItemRow = memo(function CartItemRow({
  item,
  currencySymbol,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemRowProps) {
  const lineTotalCents = Math.round(item.product.priceCents * item.quantity);
  const isWeight = ['kg', 'g', 'l', 'ml'].includes(item.product.unit);

  return (
    <View style={styles.cartItemRow}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={styles.cartItemUnitPrice}>
          {formatCents(item.product.priceCents, currencySymbol)} / {item.product.unit}
        </Text>
      </View>

      <View style={styles.quantityControls}>
        <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease}>
          <MaterialIcons name={item.quantity <= 1 && !isWeight ? 'delete-outline' : 'remove'} size={18} color="#ba1a1a" />
        </TouchableOpacity>
        <Text style={styles.qtyText}>
          {isWeight ? `${item.quantity} ${item.product.unit}` : item.quantity}
        </Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease}>
          <MaterialIcons name="add" size={18} color="#004fe6" />
        </TouchableOpacity>
      </View>

      <Text style={styles.cartItemSubtotal}>
        {formatCents(lineTotalCents, currencySymbol)}
      </Text>
    </View>
  );
});
