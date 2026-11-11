import type { LocaleShape } from '@/i18n/types';

export const inventory: LocaleShape['inventory'] = {
  header: {
    title: 'Gestión de Inventario',
  },
  metrics: {
    totalValue: 'Valor Total del Catálogo',
    activeSkus: 'SKUs Activos',
  },
  toolbar: {
    searchPlaceholder: 'Buscar por SKU o nombre...',
  },
  filters: {
    all: 'Todo el Stock',
    low: 'Stock Bajo',
    out: 'Agotados',
  },
  restock: {
    updatedTitle: 'Stock Actualizado',
    updatedMessage: 'Se agregaron +{{qty}} {{unit}} a {{name}}.',
    failed: 'Error al actualizar el stock en la base de datos.',
    modalTitle: 'Reabastecer Inventario',
    addStock: 'Cantidad de Stock a Agregar',
    currentStock: 'Actual: {{stock}} {{unit}}',
  },
};
