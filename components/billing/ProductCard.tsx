import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { ProductSelect } from '@/db/schema/products';
import { formatCents } from '@/utils/money';
import { styles } from './billing.styles';

interface ProductCardProps {
  product: ProductSelect;
  qtyInCart: number;
  currencySymbol: string;
  onPress: (product: ProductSelect) => void;
}

export const ProductCard = memo(function ProductCard({
  product,
  qtyInCart,
  currencySymbol,
  onPress,
}: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const isWeight = ['kg', 'g', 'l', 'ml'].includes(product.unit);

  return (
    <TouchableOpacity
      style={[styles.productCard, isOutOfStock && styles.productCardDisabled]}
      activeOpacity={0.7}
      onPress={() => onPress(product)}
      disabled={isOutOfStock}
    >
      <View style={styles.imageWrapper}>
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialIcons name="shopping-bag" size={32} color="#8e90a0" />
          </View>
        )}
        {qtyInCart > 0 && (
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityBadgeText}>
              {isWeight ? `${qtyInCart} ${product.unit}` : qtyInCart}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>

      <View style={styles.productMeta}>
        <Text style={styles.productPrice}>
          {formatCents(product.priceCents, currencySymbol)}
        </Text>
        <Text style={styles.productStock}>
          {isOutOfStock ? '0' : product.stock} {product.unit}
        </Text>
      </View>
    </TouchableOpacity>
  );
});
