import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import { useSessionStore } from '@/stores/session-store';
import { listTransactions } from '@/db/repositories/transaction-repository';
import { TransactionSelect } from '@/db/schema/transactions';
import { TransactionItemSelect } from '@/db/schema/transaction-items';
import { formatCents } from '@/utils/money';
import {
  TransactionCard,
  TransactionDetailModal,
  styles,
} from '@/components/transactions';

const PAYMENT_FILTERS = ['ALL', 'CASH', 'UPI', 'CARD', 'CREDIT'];

export default function TransactionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ invoice?: string }>();
  const storeId = useSessionStore((state) => state.currentUser?.storeId ?? 'DEMO-1001');
  const currencySymbol = useSessionStore((state) => state.currentUser?.currencySymbol ?? '$');

  const [transactions, setTransactions] = useState<TransactionSelect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('ALL');
  const [selectedTx, setSelectedTx] = useState<TransactionSelect | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listTransactions(storeId);
      setTransactions(data);
      if (params.invoice) {
        const found = data.find((t) => t.invoiceNumber === params.invoice);
        if (found) setSelectedTx(found);
      }
    } finally {
      setIsLoading(false);
    }
  }, [storeId, params.invoice]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (selectedMethod !== 'ALL' && t.paymentMethod !== selectedMethod) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchInvoice = t.invoiceNumber.toLowerCase().includes(q);
        const matchCustomer = (t.customerName || '').toLowerCase().includes(q);
        const matchPhone = (t.customerPhone || '').includes(q);
        if (!matchInvoice && !matchCustomer && !matchPhone) return false;
      }
      return true;
    });
  }, [transactions, selectedMethod, searchQuery]);

  const handlePrint = async (items: TransactionItemSelect[]) => {
    if (!selectedTx) return;
    try {
      const itemsHtml = items
        .map(
          (i) =>
            `<tr><td>${i.productName}</td><td>${i.quantity}</td><td>${formatCents(i.priceCents, currencySymbol)}</td><td>${formatCents(i.totalCents, currencySymbol)}</td></tr>`
        )
        .join('');

      const html = `
        <html>
          <body style="font-family: monospace; padding: 20px;">
            <h2>INVOICE #${selectedTx.invoiceNumber}</h2>
            <p>Date: ${new Date(selectedTx.createdAt).toLocaleString()}</p>
            <p>Payment: ${selectedTx.paymentMethod}</p>
            <hr/>
            <table style="width: 100%;">
              <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <hr/>
            <p><b>Total: ${formatCents(selectedTx.totalCents, currencySymbol)}</b></p>
          </body>
        </html>
      `;
      await Print.printAsync({ html });
    } catch {
      Alert.alert('Print Error', 'Could not send receipt to printer.');
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: TransactionSelect }) => (
      <TransactionCard
        transaction={item}
        currencySymbol={currencySymbol}
        onPress={(tx) => setSelectedTx(tx)}
      />
    ),
    [currencySymbol]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#131b2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions History</Text>
        <TouchableOpacity onPress={loadData}>
          <MaterialIcons name="refresh" size={24} color="#004fe6" />
        </TouchableOpacity>
      </View>

      <View style={styles.toolbar}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#737686" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search invoice or customer..."
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
          {PAYMENT_FILTERS.map((m) => {
            const active = selectedMethod === m;
            return (
              <TouchableOpacity
                key={m}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setSelectedMethod(m)}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {m}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={loadData}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="receipt-long" size={48} color="#c3c6d7" />
              <Text style={styles.emptyText}>No transactions found</Text>
            </View>
          ) : null
        }
      />

      <TransactionDetailModal
        visible={Boolean(selectedTx)}
        transaction={selectedTx}
        currencySymbol={currencySymbol}
        onClose={() => setSelectedTx(null)}
        onPrint={handlePrint}
      />
    </SafeAreaView>
  );
}
