import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ProductSelect } from '@/db/schema/products';
import { formatCents } from '@/utils/money';
import { styles } from './scanner.styles';

export interface ScannedItemState {
  product: ProductSelect;
  quantity: number;
}

interface ScannedItemRowProps {
  item: ScannedItemState;
  currencySymbol: string;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
}

export const ScannedItemRow = ({
  item,
  currencySymbol,
  onIncrement,
  onDecrement,
}: ScannedItemRowProps) => {
  const lineTotalCents = item.product.priceCents * item.quantity;

  return (
    <View style={styles.scannedItem}>
      <View style={styles.itemIconContainer}>
        <MaterialIcons name="inventory" size={20} color="#434655" />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={styles.itemSku}>SKU: {item.product.sku}</Text>
      </View>
      <View style={styles.itemActions}>
        <Text style={styles.itemPrice}>{formatCents(lineTotalCents, currencySymbol)}</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => onDecrement(item.product.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name="remove" size={14} color="#434655" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => onIncrement(item.product.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name="add" size={14} color="#434655" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
