import type { LocaleShape } from '@/i18n/types';

export const dashboard: LocaleShape['dashboard'] = {
  header: {
    title: 'SmartPOS',
  },
  bento: {
    todaySales: 'Ventas de Hoy',
    vsYesterday: 'vs ayer',
    orders: 'Pedidos',
    profit: 'Ganancia',
  },
  actions: {
    title: 'Acciones Rápidas',
    newSale: 'Nueva Venta',
    addProduct: 'Agregar Producto',
    stockEntry: 'Entrada de Stock',
    history: 'Historial',
    credit: 'Libro de Crédito',
    reports: 'Reportes',
  },
  alerts: {
    title: 'Alertas de Stock Bajo',
    itemsCount: '{{count}} Artículos',
    left: '{{count}} restantes',
    empty: 'Sin alertas de stock bajo',
  },
  revenueTrend: {
    title: 'Tendencia de Ingresos',
  },
  transactions: {
    title: 'Transacciones Recientes',
    seeAll: 'Ver Todo',
    empty: 'No hay transacciones recientes',
    items: '{{count}} artículos',
  },
};
