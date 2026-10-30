import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useDashboardMetrics } from '@/hooks/use-dashboard-metrics';
import { formatCents } from '@/utils/money';
import { styles } from '@/components/dashboard/dashboard.styles';

export default function DashboardScreen() {
  const router = useRouter();
  const { metrics, isLoading, currencySymbol, refreshMetrics } = useDashboardMetrics();

  const generateChartPaths = () => {
    const data = metrics.weeklyTrend;
    if (data.length === 0) {
      return {
        areaPath: 'M 0 100 L 350 100 L 350 120 L 0 120 Z',
        linePath: 'M 0 100 L 350 100',
      };
    }
    const amounts = data.map((d) => d.amountCents);
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
  const isPositiveGrowth = metrics.salesGrowthPercentage >= 0;

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

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshMetrics} />}
      >
        <View style={styles.mainContainer}>
          <View style={styles.bentoGrid}>
            <View style={[styles.bentoCard, styles.salesCard]}>
              <Text style={styles.bentoLabel}>{"Today's Sales"}</Text>
              <Text style={styles.salesValue}>
                {formatCents(metrics.todaySalesCents, currencySymbol)}
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
                  {isPositiveGrowth && metrics.salesGrowthPercentage > 0 ? '+' : ''}
                  {metrics.salesGrowthPercentage.toFixed(1)}% vs yesterday
                </Text>
              </View>
            </View>

            <View style={styles.bentoRow}>
              <View style={[styles.bentoCard, styles.halfCard]}>
                <Text style={styles.bentoLabel}>Orders</Text>
                <Text style={styles.bentoValue}>{metrics.ordersCount}</Text>
              </View>
              <View style={[styles.bentoCard, styles.halfCard]}>
                <Text style={styles.bentoLabel}>Profit</Text>
                <Text style={styles.bentoValue}>
                  {formatCents(metrics.profitCents, currencySymbol)}
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
                <Text style={styles.alertsBadgeText}>{metrics.lowStockAlerts.length} Items</Text>
              </View>
            </View>

            <View style={styles.alertList}>
              {metrics.lowStockAlerts.map((item, idx) => (
                <View
                  key={item.id}
                  style={[
                    styles.alertItem,
                    idx === metrics.lowStockAlerts.length - 1 && styles.lastAlertItem,
                  ]}
                >
                  <Text style={styles.alertItemName}>{item.name}</Text>
                  <Text style={styles.alertItemQty}>{item.stock} left</Text>
                </View>
              ))}
              {metrics.lowStockAlerts.length === 0 && (
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
              {metrics.weeklyTrend.length > 0 ? (
                metrics.weeklyTrend.map((trendItem, idx) => (
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
              {metrics.recentTransactions.map((tx, idx) => {
                const dateObj = new Date(tx.createdAt);
                const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <TouchableOpacity
                    key={tx.invoiceNumber || idx}
                    style={[
                      styles.transactionItem,
                      idx === metrics.recentTransactions.length - 1 && styles.lastTransactionItem,
                    ]}
                    onPress={() => router.push({ pathname: '/transactions', params: { invoice: tx.invoiceNumber } })}
                  >
                    <View style={styles.transactionIconContainer}>
                      <MaterialIcons name="receipt-long" size={20} color="#004fe6" />
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionOrder}>{tx.invoiceNumber || `Order #${tx.id}`}</Text>
                      <Text style={styles.transactionTime}>
                        {timeString} • {tx.itemsCount} items {tx.paymentMethod ? `• ${tx.paymentMethod}` : ''}
                      </Text>
                    </View>
                    <Text style={styles.transactionAmount}>
                      {formatCents(tx.totalCents, currencySymbol)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {metrics.recentTransactions.length === 0 && (
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
