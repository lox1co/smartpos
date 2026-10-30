import { useState, useEffect, useCallback } from 'react';
import { useSessionStore } from '@/stores/session-store';
import { useDataEventStore } from '@/stores/data-event-store';
import {
  getDashboardMetrics,
  DashboardMetrics,
} from '@/db/repositories/dashboard-repository';

const INITIAL_METRICS: DashboardMetrics = {
  todaySalesCents: 0,
  yesterdaySalesCents: 0,
  salesGrowthPercentage: 0,
  ordersCount: 0,
  profitCents: 0,
  lowStockAlerts: [],
  recentTransactions: [],
  weeklyTrend: [],
};

export const useDashboardMetrics = () => {
  const storeId = useSessionStore((state) => state.currentUser?.storeId ?? 'DEMO-1001');
  const currencySymbol = useSessionStore((state) => state.currentUser?.currencySymbol ?? '$');
  const transactionsVersion = useDataEventStore((state) => state.transactionsVersion);
  const productsVersion = useDataEventStore((state) => state.productsVersion);

  const [metrics, setMetrics] = useState<DashboardMetrics>(INITIAL_METRICS);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getDashboardMetrics(storeId);
      setMetrics(data);
    } catch {
      setMetrics(INITIAL_METRICS);
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    let isMounted = true;
    const execute = async () => {
      try {
        const data = await getDashboardMetrics(storeId);
        if (isMounted) setMetrics(data);
      } catch {
        if (isMounted) setMetrics(INITIAL_METRICS);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    void execute();
    return () => {
      isMounted = false;
    };
  }, [storeId, transactionsVersion, productsVersion]);

  return {
    metrics,
    isLoading,
    currencySymbol,
    refreshMetrics,
  };
};
