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
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSessionStore } from '@/stores/session-store';
import {
  listCustomers,
  upsertCustomer,
  recordCustomerCreditPayment,
} from '@/db/repositories/customer-repository';
import { CustomerSelect } from '@/db/schema/customers';
import { formatCents } from '@/utils/money';
import {
  CustomerCard,
  CustomerLedgerModal,
  AddCustomerModal,
  styles,
} from '@/components/customers';

export default function CustomersScreen() {
  const router = useRouter();
  const storeId = useSessionStore((state) => state.currentUser?.storeId ?? 'DEMO-1001');
  const currencySymbol = useSessionStore((state) => state.currentUser?.currencySymbol ?? '$');

  const [customers, setCustomers] = useState<CustomerSelect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSelect | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listCustomers(storeId);
      setCustomers(data);
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalOutstandingCents = useMemo(() => {
    return customers.reduce(
      (sum, c) => sum + (c.creditBalanceCents > 0 ? c.creditBalanceCents : 0),
      0
    );
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.phone || '').includes(q)
    );
  }, [customers, searchQuery]);

  const handleAddCustomer = async (name: string, phone?: string) => {
    const newId = `cust-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    await upsertCustomer({
      id: newId,
      storeId,
      name,
      phone: phone || null,
      creditBalanceCents: 0,
      createdAt: Date.now(),
    });
    Alert.alert('Customer Added', `${name} has been added to customers.`);
    loadData();
  };

  const handleRecordPayment = async (amountCents: number, note?: string) => {
    if (!selectedCustomer) return;
    try {
      await recordCustomerCreditPayment({
        id: `pay-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        storeId,
        customerId: selectedCustomer.id,
        entryType: 'CREDIT',
        amountCents,
        note: note || 'Repayment',
        invoiceNumber: null,
        createdAt: Date.now(),
      });
      Alert.alert(
        'Payment Recorded',
        `Recorded ${formatCents(amountCents, currencySymbol)} repayment from ${selectedCustomer.name}.`
      );
      loadData();
      setSelectedCustomer(null);
    } catch {
      Alert.alert('Error', 'Failed to record customer repayment.');
    }
  };

  const renderCustomerItem = useCallback(
    ({ item }: { item: CustomerSelect }) => (
      <CustomerCard
        customer={item}
        currencySymbol={currencySymbol}
        onPress={(c) => setSelectedCustomer(c)}
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
        <Text style={styles.headerTitle}>Customers & Khata</Text>
        <TouchableOpacity onPress={loadData}>
          <MaterialIcons name="refresh" size={24} color="#004fe6" />
        </TouchableOpacity>
      </View>

      <View style={styles.totalBanner}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Outstanding Balance (Owed)</Text>
          <Text style={styles.totalAmount}>
            {formatCents(totalOutstandingCents, currencySymbol)}
          </Text>
        </View>
      </View>

      <View style={styles.toolbar}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#737686" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customer by name or phone..."
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
      </View>

      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        renderItem={renderCustomerItem}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={loadData}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="people-outline" size={48} color="#c3c6d7" />
              <Text style={styles.emptyText}>No customers found</Text>
            </View>
          ) : null
        }
      />

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => setAddModalOpen(true)}
      >
        <MaterialIcons name="person-add" size={24} color="#ffffff" />
      </TouchableOpacity>

      <CustomerLedgerModal
        visible={Boolean(selectedCustomer)}
        customer={selectedCustomer}
        currencySymbol={currencySymbol}
        onClose={() => setSelectedCustomer(null)}
        onRecordPayment={handleRecordPayment}
      />

      <AddCustomerModal
        visible={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddCustomer}
      />
    </SafeAreaView>
  );
}
