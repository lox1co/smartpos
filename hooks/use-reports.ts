import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useSessionStore } from '@/stores/session-store';
import { listTransactionsByDateRange } from '@/db/repositories/transaction-repository';
import { TransactionSelect } from '@/db/schema/transactions';
import { formatCents } from '@/utils/money';
import { toCsv, shareTextFile, shareHtmlAsPdf } from '@/constants/export';

export type RangeId = 'today' | '7d' | '30d' | 'month';

export const RANGES: { id: RangeId; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: 'month', label: 'This Month' },
];

const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function computeRange(id: RangeId): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  let start: Date;
  if (id === 'today') {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  } else if (id === '7d') {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0);
  } else if (id === '30d') {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0, 0);
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  }
  return { start, end };
}

export const useReports = () => {
  const storeId = useSessionStore((state) => state.currentUser?.storeId ?? 'DEMO-1001');
  const shopName = useSessionStore((state) => state.currentUser?.shopName ?? 'SmartPOS Store');
  const gstNumber = useSessionStore((state) => state.currentUser?.gstNumber);
  const currencySymbol = useSessionStore((state) => state.currentUser?.currencySymbol ?? '$');

  const [rangeId, setRangeId] = useState<RangeId>('today');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [txns, setTxns] = useState<TransactionSelect[]>([]);

  const { start, end } = useMemo(() => computeRange(rangeId), [rangeId]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listTransactionsByDateRange(storeId, start.getTime(), end.getTime());
      setTxns(data);
    } catch {
      setTxns([]);
    } finally {
      setLoading(false);
    }
  }, [storeId, start, end]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const summary = useMemo(() => {
    let salesCents = 0;
    let subtotalCents = 0;
    let discountCents = 0;
    let taxCents = 0;
    let creditCents = 0;
    const byMethod: Record<string, { count: number; amountCents: number }> = {};

    txns.forEach((t) => {
      salesCents += t.totalCents;
      subtotalCents += t.subtotalCents;
      discountCents += t.discountCents;
      taxCents += t.taxCents;
      if (t.paymentStatus === 'CREDIT') creditCents += t.totalCents;
      const key = t.paymentMethod || 'OTHER';
      if (!byMethod[key]) byMethod[key] = { count: 0, amountCents: 0 };
      byMethod[key].count += 1;
      byMethod[key].amountCents += t.totalCents;
    });

    const cgstCents = Math.round(taxCents / 2);
    const sgstCents = taxCents - cgstCents;

    return {
      salesCents,
      subtotalCents,
      discountCents,
      taxCents,
      cgstCents,
      sgstCents,
      creditCents,
      orders: txns.length,
      byMethod,
    };
  }, [txns]);

  const rangeLabel = `${ymd(start)} → ${ymd(end)}`;

  const buildCsv = () => {
    const header = [
      'Invoice',
      'Date',
      'Customer',
      'Payment',
      'Status',
      'Subtotal',
      'Discount',
      'Tax',
      'CGST',
      'SGST',
      'Total',
    ];
    const rows: (string | number)[][] = [header];
    txns.forEach((t) => {
      const cgst = Math.round(t.taxCents / 2);
      const sgst = t.taxCents - cgst;
      rows.push([
        t.invoiceNumber,
        new Date(t.createdAt).toLocaleString(),
        t.customerName || '',
        t.paymentMethod,
        t.paymentStatus,
        (t.subtotalCents / 100).toFixed(2),
        (t.discountCents / 100).toFixed(2),
        (t.taxCents / 100).toFixed(2),
        (cgst / 100).toFixed(2),
        (sgst / 100).toFixed(2),
        (t.totalCents / 100).toFixed(2),
      ]);
    });
    rows.push([]);
    rows.push([
      'TOTALS',
      '',
      '',
      '',
      '',
      (summary.subtotalCents / 100).toFixed(2),
      (summary.discountCents / 100).toFixed(2),
      (summary.taxCents / 100).toFixed(2),
      (summary.cgstCents / 100).toFixed(2),
      (summary.sgstCents / 100).toFixed(2),
      (summary.salesCents / 100).toFixed(2),
    ]);
    return toCsv(rows);
  };

  const buildHtml = () => {
    const methodRows = Object.entries(summary.byMethod)
      .map(
        ([m, v]) =>
          `<tr><td>${m}</td><td class="num">${v.count}</td><td class="num">${formatCents(v.amountCents, currencySymbol)}</td></tr>`,
      )
      .join('');
    const txnRows = txns
      .map((t) => {
        const cgst = Math.round(t.taxCents / 2);
        const sgst = t.taxCents - cgst;
        return `<tr>
          <td>${t.invoiceNumber}</td>
          <td>${new Date(t.createdAt).toLocaleString()}</td>
          <td>${t.paymentMethod}${t.paymentStatus !== 'PAID' ? ` (${t.paymentStatus})` : ''}</td>
          <td class="num">${formatCents(cgst, currencySymbol)}</td>
          <td class="num">${formatCents(sgst, currencySymbol)}</td>
          <td class="num">${formatCents(t.totalCents, currencySymbol)}</td>
        </tr>`;
      })
      .join('');
    return `<!DOCTYPE html><html><head><meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, Roboto, Arial, sans-serif; color: #111; padding: 24px; }
        h1 { font-size: 20px; margin: 0; }
        .muted { color: #555; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { text-align: left; font-size: 12px; padding: 6px 4px; border-bottom: 1px solid #ddd; }
        .num { text-align: right; white-space: nowrap; }
        .cards { display: flex; flex-wrap: wrap; gap: 12px; margin: 14px 0; }
        .card { border: 1px solid #ddd; border-radius: 8px; padding: 10px 14px; min-width: 120px; }
        .card .k { font-size: 11px; color: #555; }
        .card .v { font-size: 18px; font-weight: 700; }
        h2 { font-size: 14px; margin: 18px 0 4px; }
      </style></head><body>
      <h1>${shopName} — Sales Report</h1>
      <div class="muted">${rangeLabel}${gstNumber ? ` · GSTIN: ${gstNumber}` : ''}</div>
      <div class="cards">
        <div class="card"><div class="k">Total Sales</div><div class="v">${formatCents(summary.salesCents, currencySymbol)}</div></div>
        <div class="card"><div class="k">Orders</div><div class="v">${summary.orders}</div></div>
        <div class="card"><div class="k">GST Collected</div><div class="v">${formatCents(summary.taxCents, currencySymbol)}</div></div>
        <div class="card"><div class="k">On Credit</div><div class="v">${formatCents(summary.creditCents, currencySymbol)}</div></div>
      </div>
      <h2>GST Summary</h2>
      <table><tr><td>CGST</td><td class="num">${formatCents(summary.cgstCents, currencySymbol)}</td></tr>
      <tr><td>SGST</td><td class="num">${formatCents(summary.sgstCents, currencySymbol)}</td></tr>
      <tr><td>Taxable Value</td><td class="num">${formatCents(summary.subtotalCents - summary.discountCents, currencySymbol)}</td></tr></table>
      <h2>By Payment Method</h2>
      <table><tr><th>Method</th><th class="num">Orders</th><th class="num">Amount</th></tr>${methodRows}</table>
      <h2>Transactions (${txns.length})</h2>
      <table><tr><th>Invoice</th><th>Date</th><th>Payment</th><th class="num">CGST</th><th class="num">SGST</th><th class="num">Total</th></tr>${txnRows}</table>
      </body></html>`;
  };

  const handleExportCsv = async () => {
    if (txns.length === 0) {
      Alert.alert('Nothing to Export', 'There are no sales in the selected range.');
      return;
    }
    setExporting(true);
    try {
      const uri = await shareTextFile(`sales-report-${ymd(start)}_to_${ymd(end)}.csv`, buildCsv(), 'text/csv');
      if (!uri) Alert.alert('Not Available', 'Sharing files is not supported on this platform.');
    } catch {
      Alert.alert('Export Failed', 'Could not export CSV.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPdf = async () => {
    if (txns.length === 0) {
      Alert.alert('Nothing to Export', 'There are no sales in the selected range.');
      return;
    }
    setExporting(true);
    try {
      const uri = await shareHtmlAsPdf(buildHtml(), 'Sales Report');
      if (!uri) Alert.alert('Not Available', 'Sharing files is not supported on this platform.');
    } catch {
      Alert.alert('Export Failed', 'Could not export PDF.');
    } finally {
      setExporting(false);
    }
  };

  return {
    rangeId,
    setRangeId,
    rangeLabel,
    loading,
    exporting,
    summary,
    txns,
    currencySymbol,
    handleExportCsv,
    handleExportPdf,
  };
};
