import { useMemo, useCallback } from 'react';
import { useProductCatalog } from './use-product-catalog';
import { useDataEventStore } from '@/stores/data-event-store';
import { restockProductStock } from '@/db/repositories/product-repository';

export const useInventory = (searchQuery?: string, filter: string = 'All Stock') => {
  const { products, isLoading, refreshCatalog } = useProductCatalog(undefined, searchQuery);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (filter === 'Low Stock') {
        return item.stock > 0 && item.stock <= item.lowStockAlert;
      }
      if (filter === 'Out of Stock') {
        return item.stock <= 0;
      }
      return true;
    });
  }, [products, filter]);

  const metrics = useMemo(() => {
    let totalCents = 0;
    for (const item of products) {
      totalCents += Math.round(item.priceCents * item.stock);
    }
    return {
      totalValueCents: totalCents,
      distinctCount: products.length,
    };
  }, [products]);

  const restock = useCallback(
    async (productId: string, quantity: number): Promise<void> => {
      await restockProductStock(productId, quantity);
      useDataEventStore.getState().notifyProductMutation();
    },
    []
  );

  return {
    products: filteredProducts,
    isLoading,
    metrics,
    refreshCatalog,
    restock,
  };
};
