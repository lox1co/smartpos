export const inventory = {
  header: {
    title: 'Inventory Management',
  },
  metrics: {
    totalValue: 'Total Catalog Value',
    activeSkus: 'Active SKUs',
  },
  toolbar: {
    searchPlaceholder: 'Search by SKU or name...',
  },
  filters: {
    all: 'All Stock',
    low: 'Low Stock',
    out: 'Out of Stock',
  },
  restock: {
    updatedTitle: 'Stock Updated',
    updatedMessage: 'Added +{{qty}} {{unit}} to {{name}}.',
    failed: 'Failed to update stock in database.',
    modalTitle: 'Restock Inventory',
    addStock: 'Add Stock Quantity',
    currentStock: 'Current: {{stock}} {{unit}}',
  },
} as const;
