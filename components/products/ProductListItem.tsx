import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { ProductSelect } from '@/db/schema/products';
import { formatCents } from '@/utils/money';
import { styles } from './products.styles';

interface ProductListItemProps {
  product: ProductSelect;
  currencySymbol: string;
  onPress: (product: ProductSelect) => void;
}

export const ProductListItem = memo(function ProductListItem({
  product,
  currencySymbol,
  onPress,
}: ProductListItemProps) {
  const isLowStock = product.stock <= product.lowStockAlert;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress(product)}
    >
      {product.image ? (
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={styles.placeholderImage}>
          <MaterialIcons name="inventory-2" size={26} color="#8e90a0" />
        </View>
      )}

      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.cardSku} numberOfLines={1}>
          SKU: {product.sku}
        </Text>
        <View style={styles.cardCategoryBadge}>
          <Text style={styles.cardCategoryText}>{product.category}</Text>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text style={styles.cardPrice}>
          {formatCents(product.priceCents, currencySymbol)}
        </Text>
        <Text style={[styles.cardStock, isLowStock && styles.stockLow]}>
          {product.stock} {product.unit}
        </Text>
      </View>
    </TouchableOpacity>
  );
});
