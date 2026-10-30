import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useDashboardMetrics } from '@/hooks/use-dashboard-metrics';
import { formatCents } from '@/utils/money';
import { styles } from '@/components/dashboard/dashboard.styles';

const DEFAULT_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export default function DashboardScreen() {
  const router = useRouter();
  const { t } = useTranslation(['common', 'dashboard']);
  const { metrics, isLoading, currencySymbol, refreshMetrics } = useDashboardMetrics();

  useFocusEffect(
    useCallback(() => {
      void refreshMetrics();
    }, [refreshMetrics])
  );

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

  const translateDay = (dayStr: string) => {
    const lower = dayStr.toLowerCase().slice(0, 3) as (typeof DEFAULT_DAYS)[number] | 'sun';
    if (lower === 'sun' || DEFAULT_DAYS.includes(lower as (typeof DEFAULT_DAYS)[number])) {
      return t(`dashboard:days.${lower}`);
    }
    return dayStr;
  };

  return (
    <SafeAreaView style={styles.outerContainer} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('dashboard:header.title')}</Text>
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
              <Text style={styles.bentoLabel}>{t('dashboard:bento.todaySales')}</Text>
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
                  {metrics.salesGrowthPercentage.toFixed(1)}% {t('dashboard:bento.vsYesterday')}
                </Text>
              </View>
            </View>

            <View style={styles.bentoRow}>
              <View style={[styles.bentoCard, styles.halfCard]}>
                <Text style={styles.bentoLabel}>{t('dashboard:bento.orders')}</Text>
                <Text style={styles.bentoValue}>{metrics.ordersCount}</Text>
              </View>
              <View style={[styles.bentoCard, styles.halfCard]}>
                <Text style={styles.bentoLabel}>{t('dashboard:bento.profit')}</Text>
                <Text style={styles.bentoValue}>
                  {formatCents(metrics.profitCents, currencySymbol)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsSection}>
            <Text style={styles.sectionLabel}>{t('dashboard:actions.title')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsScroll}>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryActionButton]}
                onPress={() => router.push('/billing')}
              >
                <MaterialIcons name="point-of-sale" size={24} color="#ffffff" style={styles.actionIcon} />
                <Text style={styles.primaryActionText}>{t('dashboard:actions.newSale')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/add_product')}>
                <MaterialIcons name="add-box" size={24} color="#131b2e" style={styles.actionIcon} />
                <Text style={styles.actionText}>{t('dashboard:actions.addProduct')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/inventory')}>
                <MaterialIcons name="inventory" size={24} color="#131b2e" style={styles.actionIcon} />
                <Text style={styles.actionText}>{t('dashboard:actions.stockEntry')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/transactions')}>
                <MaterialIcons name="receipt-long" size={24} color="#131b2e" style={styles.actionIcon} />
                <Text style={styles.actionText}>{t('dashboard:actions.history')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/customers')}>
                <MaterialIcons name="account-balance-wallet" size={24} color="#004fe6" style={styles.actionIcon} />
                <Text style={[styles.actionText, { color: '#004fe6', fontWeight: '600' }]}>{t('dashboard:actions.credit')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/reports')}>
                <MaterialIcons name="assessment" size={24} color="#131b2e" style={styles.actionIcon} />
                <Text style={styles.actionText}>{t('dashboard:actions.reports')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.alertsCard}>
            <View style={styles.alertsHeader}>
              <View style={styles.alertsTitleContainer}>
                <MaterialIcons name="warning" size={20} color="#ba1a1a" />
                <Text style={styles.alertsTitle}>{t('dashboard:alerts.title')}</Text>
              </View>
              <View style={styles.alertsBadge}>
                <Text style={styles.alertsBadgeText}>
                  {t('dashboard:alerts.itemsCount', { count: metrics.lowStockAlerts.length })}
                </Text>
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
                  <Text style={styles.alertItemQty}>
                    {t('dashboard:alerts.left', { count: item.stock })}
                  </Text>
                </View>
              ))}
              {metrics.lowStockAlerts.length === 0 && (
                <Text style={styles.emptyAlertText}>{t('dashboard:alerts.empty')}</Text>
              )}
            </View>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>{t('dashboard:revenueTrend.title')}</Text>
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
                  <Text key={idx} style={styles.chartLabel}>
                    {translateDay(trendItem.day)}
                  </Text>
                ))
              ) : (
                DEFAULT_DAYS.map((d, idx) => (
                  <Text key={idx} style={styles.chartLabel}>
                    {t(`dashboard:days.${d}`)}
                  </Text>
                ))
              )}
            </View>
          </View>

          <View style={styles.transactionsCard}>
            <View style={styles.transactionsHeader}>
              <Text style={styles.transactionsTitle}>{t('dashboard:transactions.title')}</Text>
              <TouchableOpacity onPress={() => router.push('/transactions')}>
                <Text style={styles.seeAllLink}>{t('dashboard:transactions.seeAll')}</Text>
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
                        {timeString} • {t('dashboard:transactions.items', { count: tx.itemsCount })} {tx.paymentMethod ? `• ${tx.paymentMethod}` : ''}
                      </Text>
                    </View>
                    <Text style={styles.transactionAmount}>
                      {formatCents(tx.totalCents, currencySymbol)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {metrics.recentTransactions.length === 0 && (
                <Text style={styles.emptyTransactionsText}>{t('dashboard:transactions.empty')}</Text>
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
