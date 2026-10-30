import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { useReports, RANGES, RangeId } from '@/hooks/use-reports';
import { formatCents } from '@/utils/money';
import { styles } from '@/components/reports/reports.styles';

const RANGE_LABEL_KEYS: Record<RangeId, 'today' | 'sevenDays' | 'thirtyDays' | 'thisMonth'> = {
  today: 'today',
  '7d': 'sevenDays',
  '30d': 'thirtyDays',
  month: 'thisMonth',
};

export default function ReportsScreen() {
  const router = useRouter();
  const { t } = useTranslation(['common', 'reports']);
  const {
    rangeId,
    setRangeId,
    rangeLabel,
    loading,
    exporting,
    summary,
    currencySymbol,
    handleExportCsv,
    handleExportPdf,
  } = useReports();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={22} color="#131b2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('reports:header.title')}</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.rangeRow}>
        {RANGES.map((r) => {
          const active = rangeId === r.id;
          return (
            <TouchableOpacity
              key={r.id}
              style={[styles.rangeChip, active && styles.rangeChipActive]}
              onPress={() => setRangeId(r.id)}
            >
              <Text style={[styles.rangeChipText, active && styles.rangeChipTextActive]}>
                {t(`reports:ranges.${RANGE_LABEL_KEYS[r.id]}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.rangeLabel}>{rangeLabel}</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#004ac6" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.cardsGrid}>
            <View style={[styles.summaryCard, styles.salesCard]}>
              <Text style={styles.summaryLabel}>{t('reports:summary.totalSales')}</Text>
              <Text style={styles.salesValue}>{formatCents(summary.salesCents, currencySymbol)}</Text>
              <Text style={styles.summarySub}>
                {t('reports:summary.ordersCount', { count: summary.orders })}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, styles.halfCard]}>
                <Text style={styles.summaryLabel}>{t('reports:summary.gstCollected')}</Text>
                <Text style={styles.summaryValue}>{formatCents(summary.taxCents, currencySymbol)}</Text>
              </View>
              <View style={[styles.summaryCard, styles.halfCard]}>
                <Text style={styles.summaryLabel}>{t('reports:summary.onCredit')}</Text>
                <Text style={[styles.summaryValue, summary.creditCents > 0 && { color: '#ba1a1a' }]}>
                  {formatCents(summary.creditCents, currencySymbol)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>{t('reports:gstSummary.title')}</Text>
            <View style={styles.line}>
              <Text style={styles.lineKey}>{t('reports:gstSummary.cgst')}</Text>
              <Text style={styles.lineVal}>{formatCents(summary.cgstCents, currencySymbol)}</Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.lineKey}>{t('reports:gstSummary.sgst')}</Text>
              <Text style={styles.lineVal}>{formatCents(summary.sgstCents, currencySymbol)}</Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.lineKey}>{t('reports:gstSummary.taxableValue')}</Text>
              <Text style={styles.lineVal}>
                {formatCents(summary.subtotalCents - summary.discountCents, currencySymbol)}
              </Text>
            </View>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>{t('reports:paymentMethod.title')}</Text>
            {Object.entries(summary.byMethod).length === 0 ? (
              <Text style={styles.emptyText}>{t('reports:paymentMethod.empty')}</Text>
            ) : (
              Object.entries(summary.byMethod).map(([m, v]) => (
                <View key={m} style={styles.line}>
                  <Text style={styles.lineKey}>
                    {m} · {v.count}
                  </Text>
                  <Text style={styles.lineVal}>{formatCents(v.amountCents, currencySymbol)}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.exportRow}>
            <TouchableOpacity
              style={[styles.exportBtn, styles.csvBtn]}
              onPress={() => void handleExportCsv()}
              disabled={exporting}
            >
              <MaterialIcons name="table-chart" size={18} color="#006329" />
              <Text style={styles.csvBtnText}>{t('reports:export.csv')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.exportBtn, styles.pdfBtn]}
              onPress={() => void handleExportPdf()}
              disabled={exporting}
            >
              <MaterialIcons name="picture-as-pdf" size={18} color="#ffffff" />
              <Text style={styles.pdfBtnText}>{t('reports:export.pdf')}</Text>
            </TouchableOpacity>
          </View>
          {exporting && (
            <Text style={styles.exportingNote}>{t('reports:export.preparing')}</Text>
          )}
          {Platform.OS === 'web' && (
            <Text style={styles.webNote}>{t('reports:export.webNote')}</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
