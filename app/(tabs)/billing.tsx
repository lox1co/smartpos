import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '@/hooks/use-cart';
import { useProductCatalog } from '@/hooks/use-product-catalog';
import { useCheckout } from '@/hooks/use-checkout';
import { ProductSelect } from '@/db/schema/products';
import {
  ProductCard,
  CartBottomSheet,
  PaymentModal,
  WeightPickerModal,
  styles,
} from '@/components/billing';
import { PRODUCT_CATEGORIES } from '@/constants/config';
import { formatCents } from '@/utils/money';

const CATEGORIES = ['All Items', ...PRODUCT_CATEGORIES];
const GRID_ITEM_HEIGHT = 207;

export default function BillingScreen() {
  const router = useRouter();

  const {
    items,
    totals,
    cartQuantities,
    currencySymbol,
    selectedCategory,
    searchQuery,
    isCartOpen,
    addItem,
    setSelectedCategory,
    setSearchQuery,
    setIsCartOpen,
  } = useCart();

  const { products, isLoading, refreshCatalog } = useProductCatalog(
    selectedCategory === 'All Items' ? undefined : selectedCategory,
    searchQuery
  );

  const { isProcessing, processCheckout } = useCheckout();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [weightModalProduct, setWeightModalProduct] = useState<ProductSelect | null>(null);

  const handleProductPress = useCallback(
    (product: ProductSelect) => {
      if (product.stock <= 0) {
        Alert.alert('Out of Stock', `${product.name} is currently out of stock.`);
        return;
      }
      if (['kg', 'g', 'l', 'ml'].includes(product.unit)) {
        setWeightModalProduct(product);
      } else {
        addItem(product, 1);
      }
    },
    [addItem]
  );

  const handleConfirmWeight = useCallback(
    (quantity: number) => {
      if (weightModalProduct) {
        addItem(weightModalProduct, quantity);
        setWeightModalProduct(null);
      }
    },
    [weightModalProduct, addItem]
  );

  const handleConfirmPayment = async (
    paymentMethod: 'CASH' | 'UPI' | 'CARD' | 'CREDIT',
    amountPaidCents?: number
  ) => {
    try {
      const tx = await processCheckout({
        paymentMethod,
        amountPaidCents,
      });
      setPaymentModalOpen(false);
      setIsCartOpen(false);
      Alert.alert(
        'Sale Complete',
        `Invoice ${tx.invoiceNumber} recorded successfully for ${formatCents(tx.totalCents, currencySymbol)}.`
      );
      refreshCatalog();
    } catch {
      Alert.alert('Checkout Error', 'Failed to complete transaction.');
    }
  };

  const renderProduct = useCallback(
    ({ item }: { item: ProductSelect }) => (
      <ProductCard
        product={item}
        qtyInCart={cartQuantities[item.id] || 0}
        currencySymbol={currencySymbol}
        onPress={handleProductPress}
      />
    ),
    [cartQuantities, currencySymbol, handleProductPress]
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<ProductSelect> | null | undefined, index: number) => ({
      length: GRID_ITEM_HEIGHT,
      offset: GRID_ITEM_HEIGHT * Math.floor(index / 2),
      index,
    }),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Billing & POS</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => router.push('/scanner')}>
            <MaterialIcons name="qr-code-scanner" size={26} color="#004fe6" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={20} color="#737686" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products or SKU..."
          placeholderTextColor="#737686"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="clear" size={18} color="#737686" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.categoryScroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderProduct}
        contentContainerStyle={styles.gridContent}
        getItemLayout={getItemLayout}
        refreshing={isLoading}
        onRefresh={refreshCatalog}
      />

      {items.length > 0 && (
        <TouchableOpacity
          style={styles.floatingCartBar}
          activeOpacity={0.85}
          onPress={() => setIsCartOpen(true)}
        >
          <View style={styles.floatingCartLeft}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totals.totalItemsCount}</Text>
            </View>
            <Text style={styles.floatingCartTotal}>
              {formatCents(totals.totalCents, currencySymbol)}
            </Text>
          </View>
          <View style={styles.floatingCartCta}>
            <Text style={styles.floatingCartCtaText}>View Cart</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ffffff" />
          </View>
        </TouchableOpacity>
      )}

      <CartBottomSheet
        visible={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckoutPress={() => {
          setIsCartOpen(false);
          setPaymentModalOpen(true);
        }}
      />

      <PaymentModal
        visible={paymentModalOpen}
        isProcessing={isProcessing}
        onClose={() => setPaymentModalOpen(false)}
        onConfirm={handleConfirmPayment}
      />

      <WeightPickerModal
        visible={Boolean(weightModalProduct)}
        product={weightModalProduct}
        initialQuantity={weightModalProduct ? cartQuantities[weightModalProduct.id] || 0 : 0}
        currencySymbol={currencySymbol}
        onClose={() => setWeightModalProduct(null)}
        onConfirm={handleConfirmWeight}
      />
    </SafeAreaView>
  );
}
