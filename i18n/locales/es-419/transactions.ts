import type { LocaleShape } from '@/i18n/types';

export const transactions: LocaleShape['transactions'] = {
  header: {
    title: 'Historial de Transacciones',
  },
  search: {
    placeholder: 'Buscar factura o cliente...',
  },
  filters: {
    all: 'TODOS',
    cash: 'EFECTIVO',
    upi: 'TRANSFERENCIA',
    card: 'TARJETA',
    credit: 'CRÉDITO',
  },
  empty: {
    noTransactions: 'No se encontraron transacciones',
  },
  print: {
    errorTitle: 'Error de Impresión',
    errorMessage: 'No se pudo enviar el recibo a la impresora.',
  },
  card: {
    offline: 'Sin conexión',
    customer: 'Cliente: {{name}}',
  },
  detail: {
    paymentMethod: 'Método de Pago',
    status: 'Estado',
    customer: 'Cliente',
    items: 'Artículos',
    subtotal: 'Subtotal',
    discount: 'Descuento',
    tax: 'Impuesto',
    total: 'Total',
    printReceipt: 'Imprimir Recibo',
    invoiceHeader: 'FACTURA #{{number}}',
    date: 'Fecha: {{date}}',
    payment: 'Pago: {{method}}',
    itemCol: 'Artículo',
    qtyCol: 'Cant',
    priceCol: 'Precio',
    totalCol: 'Total',
    totalAmount: 'Total: {{amount}}',
  },
};
