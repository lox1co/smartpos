import React, { useState, useCallback, useMemo } from 'react';
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
import { useTranslation } from 'react-i18next';
import { useInventory } from '@/hooks/use-inventory';
import { useSessionStore } from '@/stores/session-store';
import { ProductSelect } from '@/db/schema/products';
import { formatCents } from '@/utils/money';
import {
  InventoryCard,
  StockRestockModal,
  styles,
} from '@/components/inventory';

export default function InventoryScreen() {
  const { t } = useTranslation(['common', 'inventory']);
  const currencySymbol = useSessionStore((state) => state.currentUser?.currencySymbol ?? '$');

  const filterOptions = useMemo(() => [
    { key: 'all', label: t('inventory:filters.all') },
    { key: 'low', label: t('inventory:filters.low') },
    { key: 'out', label: t('inventory:filters.out') },
  ], [t]);

  const [selectedFilterKey, setSelectedFilterKey] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [restockTarget, setRestockTarget] = useState<ProductSelect | null>(null);

  const selectedFilterBackend = selectedFilterKey === 'low'
    ? 'Low Stock'
    : selectedFilterKey === 'out'
    ? 'Out of Stock'
    : 'All Stock';

  const { products, isLoading, metrics, refreshCatalog, restock } = useInventory(
    searchQuery,
    selectedFilterBackend
  );

  const handleRestock = useCallback((product: ProductSelect) => {
    setRestockTarget(product);
  }, []);

  const handleConfirmRestock = async (qty: number) => {
    if (!restockTarget) return;
    try {
      await restock(restockTarget.id, qty);
      Alert.alert(
        t('inventory:restock.updatedTitle'),
        t('inventory:restock.updatedMessage', {
          qty,
          unit: restockTarget.unit,
          name: restockTarget.name,
        })
      );
      setRestockTarget(null);
    } catch {
      Alert.alert(t('common:status.error'), t('inventory:restock.failed'));
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
        <Text style={styles.headerTitle}>{t('inventory:header.title')}</Text>
      </View>

      <View style={styles.metricsBanner}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{t('inventory:metrics.totalValue')}</Text>
          <Text style={styles.metricValue}>
            {formatCents(metrics.totalValueCents, currencySymbol)}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{t('inventory:metrics.activeSkus')}</Text>
          <Text style={styles.metricValue}>{metrics.distinctCount}</Text>
        </View>
      </View>

      <View style={styles.toolbar}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#737686" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('inventory:toolbar.searchPlaceholder')}
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
          {filterOptions.map((f) => {
            const active = selectedFilterKey === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setSelectedFilterKey(f.key)}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {f.label}
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
