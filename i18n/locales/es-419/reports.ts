import type { LocaleShape } from '@/i18n/types';

export const reports: LocaleShape['reports'] = {
  header: {
    title: 'Reportes',
  },
  ranges: {
    today: 'Hoy',
    sevenDays: '7 Días',
    thirtyDays: '30 Días',
    thisMonth: 'Este Mes',
  },
  summary: {
    totalSales: 'Ventas Totales',
    ordersCount: '{{count}} pedidos',
    gstCollected: 'Impuestos Cobrados',
    onCredit: 'A Crédito',
  },
  gstSummary: {
    title: 'Resumen de Impuestos',
    cgst: 'CGST',
    sgst: 'SGST',
    taxableValue: 'Base Imponible',
  },
  paymentMethod: {
    title: 'Por Método de Pago',
    empty: 'No hay ventas en este período.',
  },
  export: {
    csv: 'Exportar CSV',
    pdf: 'Exportar PDF',
    preparing: 'Preparando archivo…',
    webNote: 'Exportar/compartir archivos requiere la app móvil.',
  },
};
