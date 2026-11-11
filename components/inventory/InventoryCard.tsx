import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ProductSelect } from '@/db/schema/products';
import { styles } from './inventory.styles';

interface InventoryCardProps {
  product: ProductSelect;
  onRestock: (product: ProductSelect) => void;
}

export const InventoryCard = memo(function InventoryCard({
  product,
  onRestock,
}: InventoryCardProps) {
  const isOut = product.stock <= 0;
  const isLow = !isOut && product.stock <= product.lowStockAlert;

  return (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardSku}>SKU: {product.sku}</Text>
          <View
            style={[
              styles.stockBadge,
              isLow && styles.stockBadgeLow,
              isOut && styles.stockBadgeOut,
            ]}
          >
            <Text
              style={[
                styles.stockBadgeText,
                isLow && styles.stockBadgeTextLow,
                isOut && styles.stockBadgeTextOut,
              ]}
            >
              {isOut ? 'Out of Stock' : `${product.stock} ${product.unit}`}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.restockBtn}
        activeOpacity={0.8}
        onPress={() => onRestock(product)}
      >
        <MaterialIcons name="add" size={16} color="#ffffff" />
        <Text style={styles.restockBtnText}>Restock</Text>
      </TouchableOpacity>
    </View>
  );
});
