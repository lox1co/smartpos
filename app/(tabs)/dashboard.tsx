import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { API_BASE_URL } from '@/constants/config';
import { useSessionStore } from '@/stores/session-store';
import { formatCents, toCents } from '@/utils/money';
import { styles } from '@/components/dashboard/dashboard.styles';

interface StockAlert {
  id: string | number;
  name: string;
  stock: number;
}

interface RecentTx {
  id: string | number;
  invoice_number?: string;
  created_at: string;
  items_count: number;
  payment_method?: string;
  total: number;
}

interface TrendItem {
  day: string;
  date: string;
  amount: number;
}

export default function DashboardScreen() {
  const router = useRouter();
  const token = useSessionStore((state) => state.currentUser?.token);
  const currencySymbol = useSessionStore((state) => state.currentUser?.currencySymbol ?? '$');
  const clearSession = useSessionStore((state) => state.clearSession);

  const [metrics, setMetrics] = useState({
    today_sales: 0,
    yesterday_sales: 0,
    sales_growth_percentage: 0,
    orders_count: 0,
    profit: 0,
    low_stock_alerts: [] as StockAlert[],
    recent_transactions: [] as RecentTx[],
    weekly_trend: [] as TrendItem[],
  });

  const fetchDashboardMetrics = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        clearSession();
        router.replace('/login');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch dashboard metrics');
      const data = await response.json();
      setMetrics({
        today_sales: parseFloat(data.today_sales || 0),
        yesterday_sales: parseFloat(data.yesterday_sales || 0),
        sales_growth_percentage: Number(data.sales_growth_percentage || 0),
        orders_count: Number(data.orders_count || 0),
        profit: parseFloat(data.profit || 0),
        low_stock_alerts: data.low_stock_alerts || [],
        recent_transactions: data.recent_transactions || [],
        weekly_trend: (data.weekly_trend || []).map((item: TrendItem) => ({
          day: item.day,
          date: item.date,
          amount: parseFloat(String(item.amount || 0)),
        })),
      });
    } catch {
      // Offline fallback
    }
  }, [token, clearSession, router]);

  useEffect(() => {
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

  const generateChartPaths = () => {
    const data = metrics.weekly_trend || [];
    if (data.length === 0) {
      return {
        areaPath: 'M 0 100 L 350 100 L 350 120 L 0 120 Z',
        linePath: 'M 0 100 L 350 100',
      };
    }
    const amounts = data.map((d) => Number(d.amount) || 0);
    const maxVal = Math.max(...amounts, 1);
    const width = 350;
    const paddingBottom = 20;
    const paddingTop = 15;
    const chartHeight = 120 - paddingBottom - paddingTop;

    const stepX = data.length > 1 ? width / (data.length - 1) : width;
    const points = amounts.map((val, idx) => {
      const x = idx * stepX;
      const normalizedY = maxVal === 0 ? 0 : val / maxVal;
      const y = 120 - paddingBottom - normalizedY * chartHeight;
      return { x, y };
    });

    const linePath = points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}` : `${acc} L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    }, '');

    const areaPath = `${linePath} L ${width} 120 L 0 120 Z`;
    return { areaPath, linePath };
  };

  const { areaPath, linePath } = generateChartPaths();
  const isPositiveGrowth = metrics.sales_growth_percentage >= 0;

  return (
    <SafeAreaView style={styles.outerContainer} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SmartPOS</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => router.push('/scanner')}
          >
            <MaterialIcons name="qr-code-scanner" size={24} color="#004fe6" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={styles.bentoGrid}>
            <View style={[styles.bentoCard, styles.salesCard]}>
              <Text style={styles.bentoLabel}>{"Today's Sales"}</Text>
              <Text style={styles.salesValue}>
                {formatCents(toCents(metrics.today_sales), currencySymbol)}
              </Text>
              <View style={styles.trendContainer}>
                <MaterialIcons
                  name={isPositiveGrowth ? 'trending-up' : 'trending-down'}
                  size={16}
                  color={isPositiveGrowth ? '#006329' : '#ba1a1a'}
                />
                <Text
                  style={[
                    styles.trendText,
                    { color: isPositiveGrowth ? '#006329' : '#ba1a1a' },
                  ]}
                >
                  {isPositiveGrowth && metrics.sales_growth_percentage > 0 ? '+' : ''}
                  {metrics.sales_growth_percentage.toFixed(1)}% vs yesterday
                </Text>
              </View>
            </View>

            <View style={styles.bentoRow}>
              <View style={[styles.bentoCard, styles.halfCard]}>
                <Text style={styles.bentoLabel}>Orders</Text>
                <Text style={styles.bentoValue}>{metrics.orders_count}</Text>
              </View>
              <View style={[styles.bentoCard, styles.halfCard]}>
                <Text style={styles.bentoLabel}>Profit</Text>
                <Text style={styles.bentoValue}>
                  {formatCents(toCents(metrics.profit), currencySymbol)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsSection}>
            <Text style={styles.sectionLabel}>Quick Actions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsScroll}>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryActionButton]}
                onPress={() => router.push('/billing')}
              >
                <MaterialIcons name="point-of-sale" size={24} color="#ffffff" style={styles.actionIcon} />
                <Text style={styles.primaryActionText}>New Sale</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/add_product')}>
                <MaterialIcons name="add-box" size={24} color="#131b2e" style={styles.actionIcon} />
                <Text style={styles.actionText}>Add Product</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/inventory')}>
                <MaterialIcons name="inventory" size={24} color="#131b2e" style={styles.actionIcon} />
                <Text style={styles.actionText}>Stock Entry</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/transactions')}>
                <MaterialIcons name="receipt-long" size={24} color="#131b2e" style={styles.actionIcon} />
                <Text style={styles.actionText}>History</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/customers')}>
                <MaterialIcons name="account-balance-wallet" size={24} color="#004fe6" style={styles.actionIcon} />
                <Text style={[styles.actionText, { color: '#004fe6', fontWeight: '600' }]}>Khata / Credit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/reports')}>
                <MaterialIcons name="assessment" size={24} color="#131b2e" style={styles.actionIcon} />
                <Text style={styles.actionText}>Reports</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.alertsCard}>
            <View style={styles.alertsHeader}>
              <View style={styles.alertsTitleContainer}>
                <MaterialIcons name="warning" size={20} color="#ba1a1a" />
                <Text style={styles.alertsTitle}>Low Stock Alerts</Text>
              </View>
              <View style={styles.alertsBadge}>
                <Text style={styles.alertsBadgeText}>{metrics.low_stock_alerts.length} Items</Text>
              </View>
            </View>

            <View style={styles.alertList}>
              {metrics.low_stock_alerts.map((item, idx) => (
                <View
                  key={item.id}
                  style={[
                    styles.alertItem,
                    idx === metrics.low_stock_alerts.length - 1 && styles.lastAlertItem,
                  ]}
                >
                  <Text style={styles.alertItemName}>{item.name}</Text>
                  <Text style={styles.alertItemQty}>{item.stock} left</Text>
                </View>
              ))}
              {metrics.low_stock_alerts.length === 0 && (
                <Text style={styles.emptyAlertText}>No low stock alerts</Text>
              )}
            </View>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Revenue Trend</Text>
            <View style={styles.chartContainer}>
              <Svg width="100%" height="100%" viewBox="0 0 350 120" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                <Defs>
                  <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#004fe6" stopOpacity="0.25" />
                    <Stop offset="1" stopColor="#004fe6" stopOpacity="0" />
                  </LinearGradient>
                </Defs>
                <Path d={areaPath} fill="url(#chartGrad)" />
                <Path d={linePath} fill="none" stroke="#004fe6" strokeWidth="3" />
              </Svg>
            </View>
            <View style={styles.chartLabelsRow}>
              {metrics.weekly_trend.length > 0 ? (
                metrics.weekly_trend.map((trendItem, idx) => (
                  <Text key={idx} style={styles.chartLabel}>{trendItem.day}</Text>
                ))
              ) : (
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, idx) => (
                  <Text key={idx} style={styles.chartLabel}>{d}</Text>
                ))
              )}
            </View>
          </View>

          <View style={styles.transactionsCard}>
            <View style={styles.transactionsHeader}>
              <Text style={styles.transactionsTitle}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => router.push('/transactions')}>
                <Text style={styles.seeAllLink}>See All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.transactionList}>
              {metrics.recent_transactions.map((tx, idx) => {
                const dateObj = new Date(tx.created_at);
                const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <TouchableOpacity
                    key={tx.invoice_number || idx}
                    style={[
                      styles.transactionItem,
                      idx === metrics.recent_transactions.length - 1 && styles.lastTransactionItem,
                    ]}
                    onPress={() => router.push({ pathname: '/transactions', params: { invoice: tx.invoice_number } })}
                  >
                    <View style={styles.transactionIconContainer}>
                      <MaterialIcons name="receipt-long" size={20} color="#004fe6" />
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionOrder}>{tx.invoice_number || `Order #${tx.id}`}</Text>
                      <Text style={styles.transactionTime}>
                        {timeString} • {tx.items_count} items {tx.payment_method ? `• ${tx.payment_method}` : ''}
                      </Text>
                    </View>
                    <Text style={styles.transactionAmount}>
                      {formatCents(toCents(tx.total), currencySymbol)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {metrics.recent_transactions.length === 0 && (
                <Text style={styles.emptyTransactionsText}>No recent transactions</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/add_product')}>
        <MaterialIcons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
