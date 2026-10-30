export const transactions = {
  header: {
    title: 'Transactions History',
  },
  search: {
    placeholder: 'Search invoice or customer...',
  },
  filters: {
    all: 'ALL',
    cash: 'CASH',
    upi: 'UPI',
    card: 'CARD',
    credit: 'CREDIT',
  },
  empty: {
    noTransactions: 'No transactions found',
  },
  print: {
    errorTitle: 'Print Error',
    errorMessage: 'Could not send receipt to printer.',
  },
  card: {
    offline: 'Offline',
    customer: 'Customer: {{name}}',
  },
  detail: {
    paymentMethod: 'Payment Method',
    status: 'Status',
    customer: 'Customer',
    items: 'Items',
    subtotal: 'Subtotal',
    discount: 'Discount',
    tax: 'Tax',
    total: 'Total',
    printReceipt: 'Print Receipt',
    invoiceHeader: 'INVOICE #{{number}}',
    date: 'Date: {{date}}',
    payment: 'Payment: {{method}}',
    itemCol: 'Item',
    qtyCol: 'Qty',
    priceCol: 'Price',
    totalCol: 'Total',
    totalAmount: 'Total: {{amount}}',
  },
} as const;
