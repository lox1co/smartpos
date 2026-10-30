import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSessionStore } from '@/stores/session-store';
import { useDataEventStore } from '@/stores/data-event-store';
import {
  listCustomers,
  upsertCustomer,
  recordCustomerCreditPayment,
  getCustomerCreditEntries,
} from '@/db/repositories/customer-repository';
import { CustomerSelect } from '@/db/schema/customers';
import { CreditEntrySelect } from '@/db/schema/credit-entries';
import { generateUuid } from '@/utils/uuid';

export const useCustomerCreditEntries = (customerId?: string, visible: boolean = false) => {
  const [entries, setEntries] = useState<CreditEntrySelect[]>([]);
  const [loading, setLoading] = useState(false);

  const loadEntries = useCallback(async () => {
    if (!customerId) {
      setEntries([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getCustomerCreditEntries(customerId);
      setEntries(data);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    let isMounted = true;
    if (!visible || !customerId) {
      return;
    }
    const execute = async () => {
      try {
        const data = await getCustomerCreditEntries(customerId);
        if (isMounted) setEntries(data);
      } catch {
        if (isMounted) setEntries([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void execute();
    return () => {
      isMounted = false;
    };
  }, [visible, customerId]);

  return {
    entries,
    loading,
    refreshEntries: loadEntries,
  };
};

export const useCustomers = () => {
  const storeId = useSessionStore((state) => state.currentUser?.storeId ?? 'DEMO-1001');
  const currencySymbol = useSessionStore((state) => state.currentUser?.currencySymbol ?? '$');
  const customersVersion = useDataEventStore((state) => state.customersVersion);

  const [customers, setCustomers] = useState<CustomerSelect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listCustomers(storeId);
      setCustomers(data);
    } catch {
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    let isMounted = true;
    const execute = async () => {
      try {
        const data = await listCustomers(storeId);
        if (isMounted) setCustomers(data);
      } catch {
        if (isMounted) setCustomers([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    void execute();
    return () => {
      isMounted = false;
    };
  }, [storeId, customersVersion]);

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

  const addCustomer = useCallback(
    async (name: string, phone?: string): Promise<string> => {
      const newId = generateUuid();
      await upsertCustomer({
        id: newId,
        storeId,
        name,
        phone: phone || null,
        creditBalanceCents: 0,
        createdAt: Date.now(),
      });
      useDataEventStore.getState().notifyCustomerMutation();
      return newId;
    },
    [storeId]
  );

  const recordPayment = useCallback(
    async (customerId: string, amountCents: number, note?: string): Promise<void> => {
      await recordCustomerCreditPayment({
        id: generateUuid(),
        storeId,
        customerId,
        entryType: 'CREDIT',
        amountCents,
        note: note || 'Repayment',
        invoiceNumber: null,
        createdAt: Date.now(),
      });
      useDataEventStore.getState().notifyCustomerMutation();
    },
    [storeId]
  );

  return {
    customers,
    filteredCustomers,
    isLoading,
    searchQuery,
    totalOutstandingCents,
    currencySymbol,
    setSearchQuery,
    loadData,
    addCustomer,
    recordPayment,
  };
};
