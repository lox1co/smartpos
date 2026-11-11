import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSessionStore } from '@/stores/session-store';
import { useDataEventStore } from '@/stores/data-event-store';
import {
  listTransactions,
  getTransactionItems,
} from '@/db/repositories/transaction-repository';
import { TransactionSelect } from '@/db/schema/transactions';
import { TransactionItemSelect } from '@/db/schema/transaction-items';

export const useTransactionItems = (transactionId?: string, visible: boolean = false) => {
  const [items, setItems] = useState<TransactionItemSelect[]>([]);
  const [loading, setLoading] = useState(false);

  const loadItems = useCallback(async () => {
    if (!transactionId) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getTransactionItems(transactionId);
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [transactionId]);

  useEffect(() => {
    let isMounted = true;
    if (!visible || !transactionId) {
      return;
    }
    const execute = async () => {
      try {
        const data = await getTransactionItems(transactionId);
        if (isMounted) setItems(data);
      } catch {
        if (isMounted) setItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void execute();
    return () => {
      isMounted = false;
    };
  }, [visible, transactionId]);

  return {
    items,
    loading,
    refreshItems: loadItems,
  };
};

export const useTransactionHistory = (initialInvoice?: string) => {
  const storeId = useSessionStore((state) => state.currentUser?.storeId ?? 'DEMO-1001');
  const currencySymbol = useSessionStore((state) => state.currentUser?.currencySymbol ?? '$');
  const transactionsVersion = useDataEventStore((state) => state.transactionsVersion);

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
      if (initialInvoice) {
        const found = data.find((t) => t.invoiceNumber === initialInvoice);
        if (found) setSelectedTx(found);
      }
    } finally {
      setIsLoading(false);
    }
  }, [storeId, initialInvoice]);

  useEffect(() => {
    let isMounted = true;
    const execute = async () => {
      try {
        const data = await listTransactions(storeId);
        if (isMounted) {
          setTransactions(data);
          if (initialInvoice) {
            const found = data.find((t) => t.invoiceNumber === initialInvoice);
            if (found) setSelectedTx(found);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    void execute();
    return () => {
      isMounted = false;
    };
  }, [storeId, initialInvoice, transactionsVersion]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (selectedMethod !== 'ALL' && t.paymentMethod !== selectedMethod) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.invoiceNumber.toLowerCase().includes(q) ||
          (t.customerName && t.customerName.toLowerCase().includes(q)) ||
          (t.customerPhone && t.customerPhone.includes(q))
        );
      }
      return true;
    });
  }, [transactions, selectedMethod, searchQuery]);

  return {
    transactions: filteredTransactions,
    rawTransactions: transactions,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedMethod,
    setSelectedMethod,
    selectedTx,
    setSelectedTx,
    currencySymbol,
    refreshTransactions: loadData,
  };
};
