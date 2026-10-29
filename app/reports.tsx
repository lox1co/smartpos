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
import { MaterialIcons } from '@expo/vector-icons';
import { useReports, RANGES } from '@/hooks/use-reports';
import { formatCents } from '@/utils/money';
import { styles } from '@/components/reports/reports.styles';

export default function ReportsScreen() {
  const router = useRouter();
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
        <Text style={styles.headerTitle}>Reports</Text>
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
              <Text style={[styles.rangeChipText, active && styles.rangeChipTextActive]}>{r.label}</Text>
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
              <Text style={styles.summaryLabel}>Total Sales</Text>
              <Text style={styles.salesValue}>{formatCents(summary.salesCents, currencySymbol)}</Text>
              <Text style={styles.summarySub}>{summary.orders} orders</Text>
            </View>
            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, styles.halfCard]}>
                <Text style={styles.summaryLabel}>GST Collected</Text>
                <Text style={styles.summaryValue}>{formatCents(summary.taxCents, currencySymbol)}</Text>
              </View>
              <View style={[styles.summaryCard, styles.halfCard]}>
                <Text style={styles.summaryLabel}>On Credit</Text>
                <Text style={[styles.summaryValue, summary.creditCents > 0 && { color: '#ba1a1a' }]}>
                  {formatCents(summary.creditCents, currencySymbol)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>GST Summary</Text>
            <View style={styles.line}>
              <Text style={styles.lineKey}>CGST</Text>
              <Text style={styles.lineVal}>{formatCents(summary.cgstCents, currencySymbol)}</Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.lineKey}>SGST</Text>
              <Text style={styles.lineVal}>{formatCents(summary.sgstCents, currencySymbol)}</Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.lineKey}>Taxable Value</Text>
              <Text style={styles.lineVal}>
                {formatCents(summary.subtotalCents - summary.discountCents, currencySymbol)}
              </Text>
            </View>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>By Payment Method</Text>
            {Object.entries(summary.byMethod).length === 0 ? (
              <Text style={styles.emptyText}>No sales in this range.</Text>
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
              <Text style={styles.csvBtnText}>Export CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.exportBtn, styles.pdfBtn]}
              onPress={() => void handleExportPdf()}
              disabled={exporting}
            >
              <MaterialIcons name="picture-as-pdf" size={18} color="#ffffff" />
              <Text style={styles.pdfBtnText}>Export PDF</Text>
            </TouchableOpacity>
          </View>
          {exporting && (
            <Text style={styles.exportingNote}>Preparing file…</Text>
          )}
          {Platform.OS === 'web' && (
            <Text style={styles.webNote}>File export/share requires the mobile app.</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
