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
import { useRouter, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '@/hooks/use-cart';
import { useProductCatalog } from '@/hooks/use-product-catalog';
import { useCheckout, CompletedCheckoutResult } from '@/hooks/use-checkout';
import { useSessionStore } from '@/stores/session-store';
import { ProductSelect } from '@/db/schema/products';
import {
  ProductCard,
  CartBottomSheet,
  PaymentModal,
  PaymentMethod,
  PaymentConfirmOptions,
  WeightPickerModal,
  PostCheckoutModal,
  styles,
} from '@/components/billing';
import { PRODUCT_CATEGORIES } from '@/constants/config';
import { formatCents } from '@/utils/money';

const CATEGORIES = ['All Items', ...PRODUCT_CATEGORIES];
const GRID_ITEM_HEIGHT = 207;

export default function BillingScreen() {
  const router = useRouter();
  const { t } = useTranslation(['common', 'billing']);

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

  const { products, refreshCatalog } = useProductCatalog(selectedCategory, searchQuery);
  const { isProcessing, processCheckout } = useCheckout();

  useFocusEffect(
    useCallback(() => {
      void refreshCatalog();
    }, [refreshCatalog])
  );

  const shopName = useSessionStore((state) => state.currentUser?.shopName ?? 'SmartPOS Store');
  const storeAddress = useSessionStore((state) => state.currentUser?.businessAddress);
  const storePhone = useSessionStore((state) => state.currentUser?.storePhone || state.currentUser?.phone);
  const gstNumber = useSessionStore((state) => state.currentUser?.gstNumber);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [weightModalProduct, setWeightModalProduct] = useState<ProductSelect | null>(null);
  const [completedSale, setCompletedSale] = useState<CompletedCheckoutResult | null>(null);

  const handleProductPress = useCallback(
    (product: ProductSelect) => {
      const isWeight = product.unit === 'kg' || product.unit === 'g';
      if (isWeight) {
        setWeightModalProduct(product);
      } else {
        addItem(product);
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
    paymentMethod: PaymentMethod,
    options?: PaymentConfirmOptions
  ) => {
    try {
      const saleResult = await processCheckout({
        paymentMethod,
        customerName: options?.customerName,
        customerPhone: options?.customerPhone,
        amountPaidCents: options?.amountPaidCents,
      });
      setPaymentModalOpen(false);
      setIsCartOpen(false);
      setCompletedSale(saleResult);
    } catch {
      Alert.alert(t('billing:checkout.errorTitle'), t('billing:checkout.error'));
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
        <Text style={styles.headerTitle}>{t('billing:header.title')}</Text>
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
          placeholder={t('billing:search.placeholder')}
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
            const label = cat === 'All Items' ? t('billing:categories.allItems') : cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        getItemLayout={getItemLayout}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <MaterialIcons name="inventory-2" size={48} color="#c3c6d7" />
            <Text style={{ color: '#737686', marginTop: 12 }}>
              {t('billing:empty.noProducts')}
            </Text>
          </View>
        }
      />

      {items.length > 0 && (
        <TouchableOpacity
          style={styles.floatingCartBar}
          activeOpacity={0.88}
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
            <Text style={styles.floatingCartCtaText}>{t('billing:floating.viewCart')}</Text>
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

      <PostCheckoutModal
        visible={Boolean(completedSale)}
        result={completedSale}
        currencySymbol={currencySymbol}
        shopName={shopName}
        storeAddress={storeAddress}
        storePhone={storePhone}
        gstNumber={gstNumber}
        onNewSale={() => setCompletedSale(null)}
      />
    </SafeAreaView>
  );
}
