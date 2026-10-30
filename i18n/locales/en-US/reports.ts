export const reports = {
  header: {
    title: 'Reports',
  },
  ranges: {
    today: 'Today',
    sevenDays: '7 Days',
    thirtyDays: '30 Days',
    thisMonth: 'This Month',
  },
  summary: {
    totalSales: 'Total Sales',
    ordersCount: '{{count}} orders',
    gstCollected: 'GST Collected',
    onCredit: 'On Credit',
  },
  gstSummary: {
    title: 'GST Summary',
    cgst: 'CGST',
    sgst: 'SGST',
    taxableValue: 'Taxable Value',
  },
  paymentMethod: {
    title: 'By Payment Method',
    empty: 'No sales in this range.',
  },
  export: {
    csv: 'Export CSV',
    pdf: 'Export PDF',
    preparing: 'Preparing file…',
    webNote: 'File export/share requires the mobile app.',
  },
} as const;
