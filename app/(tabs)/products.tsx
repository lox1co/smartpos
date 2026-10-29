import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useProductCatalog } from '@/hooks/use-product-catalog';
import { useSessionStore } from '@/stores/session-store';
import { ProductSelect } from '@/db/schema/products';
import {
  ProductListItem,
  ProductSortModal,
  SORT_OPTIONS,
  styles,
} from '@/components/products';
import { PRODUCT_CATEGORIES } from '@/constants/config';

export default function ProductsScreen() {
  const router = useRouter();
  const currencySymbol = useSessionStore((state) => state.currentUser?.currencySymbol ?? '$');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [selectedSort, setSelectedSort] = useState('name_asc');
  const [sortModalOpen, setSortModalOpen] = useState(false);

  const { products, isLoading, refreshCatalog } = useProductCatalog(
    selectedCategory === 'All Items' ? undefined : selectedCategory,
    searchQuery
  );

  const sortedProducts = useMemo(() => {
    const list = [...products];
    list.sort((a, b) => {
      if (selectedSort === 'name_asc') return a.name.localeCompare(b.name);
      if (selectedSort === 'name_desc') return b.name.localeCompare(a.name);
      if (selectedSort === 'price_asc') return a.priceCents - b.priceCents;
      if (selectedSort === 'price_desc') return b.priceCents - a.priceCents;
      if (selectedSort === 'stock_asc') return a.stock - b.stock;
      if (selectedSort === 'stock_desc') return b.stock - a.stock;
      return 0;
    });
    return list;
  }, [products, selectedSort]);

  const activeSortLabel = useMemo(() => {
    return SORT_OPTIONS.find((s) => s.id === selectedSort)?.label ?? 'Sort';
  }, [selectedSort]);

  const handleProductPress = useCallback(
    (product: ProductSelect) => {
      router.push(`/add_product?id=${product.id}`);
    },
    [router]
  );

  const renderProductItem = useCallback(
    ({ item }: { item: ProductSelect }) => (
      <ProductListItem
        product={item}
        currencySymbol={currencySymbol}
        onPress={handleProductPress}
      />
    ),
    [currencySymbol, handleProductPress]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products Catalog</Text>
      </View>

      <View style={styles.toolbar}>
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

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setSortModalOpen(true)}
          >
            <MaterialIcons name="sort" size={16} color="#004fe6" />
            <Text style={styles.filterBtnText} numberOfLines={1}>
              {activeSortLabel}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterBtn, selectedCategory !== 'All Items' && styles.filterBtnActive]}
            onPress={() => {
              const allCategories = ['All Items', ...PRODUCT_CATEGORIES];
              const nextIndex = (allCategories.indexOf(selectedCategory) + 1) % allCategories.length;
              setSelectedCategory(allCategories[nextIndex]);
            }}
          >
            <MaterialIcons
              name="category"
              size={16}
              color={selectedCategory !== 'All Items' ? '#ffffff' : '#004fe6'}
            />
            <Text
              style={[
                styles.filterBtnText,
                selectedCategory !== 'All Items' && styles.filterBtnTextActive,
              ]}
              numberOfLines={1}
            >
              {selectedCategory}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={sortedProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={refreshCatalog}
      />

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push('/add_product')}
      >
        <MaterialIcons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>

      <ProductSortModal
        visible={sortModalOpen}
        selectedSort={selectedSort}
        onSelect={setSelectedSort}
        onClose={() => setSortModalOpen(false)}
      />
    </SafeAreaView>
  );
}
