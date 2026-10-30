import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useInventory } from '@/hooks/use-inventory';
import { useSessionStore } from '@/stores/session-store';
import { ProductSelect } from '@/db/schema/products';
import { formatCents } from '@/utils/money';
import {
  InventoryCard,
  StockRestockModal,
  styles,
} from '@/components/inventory';

const FILTERS = ['All Stock', 'Low Stock', 'Out of Stock'];

export default function InventoryScreen() {
  const currencySymbol = useSessionStore((state) => state.currentUser?.currencySymbol ?? '$');

  const [selectedFilter, setSelectedFilter] = useState('All Stock');
  const [searchQuery, setSearchQuery] = useState('');
  const [restockTarget, setRestockTarget] = useState<ProductSelect | null>(null);

  const { products, isLoading, metrics, refreshCatalog, restock } = useInventory(
    searchQuery,
    selectedFilter
  );

  const handleRestock = useCallback((product: ProductSelect) => {
    setRestockTarget(product);
  }, []);

  const handleConfirmRestock = async (qty: number) => {
    if (!restockTarget) return;
    try {
      await restock(restockTarget.id, qty);
      Alert.alert(
        'Stock Updated',
        `Added +${qty} ${restockTarget.unit} to ${restockTarget.name}.`
      );
      setRestockTarget(null);
    } catch {
      Alert.alert('Error', 'Failed to update stock in database.');
    }
  };

  const renderInventoryItem = useCallback(
    ({ item }: { item: ProductSelect }) => (
      <InventoryCard product={item} onRestock={handleRestock} />
    ),
    [handleRestock]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory Management</Text>
      </View>

      <View style={styles.metricsBanner}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total Catalog Value</Text>
          <Text style={styles.metricValue}>
            {formatCents(metrics.totalValueCents, currencySymbol)}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Active SKUs</Text>
          <Text style={styles.metricValue}>{metrics.distinctCount}</Text>
        </View>
      </View>

      <View style={styles.toolbar}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#737686" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by SKU or name..."
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

        <View style={styles.filtersRow}>
          {FILTERS.map((f) => {
            const active = selectedFilter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setSelectedFilter(f)}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderInventoryItem}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={refreshCatalog}
      />

      <StockRestockModal
        visible={Boolean(restockTarget)}
        product={restockTarget}
        onClose={() => setRestockTarget(null)}
        onConfirmRestock={handleConfirmRestock}
      />
    </SafeAreaView>
  );
}
