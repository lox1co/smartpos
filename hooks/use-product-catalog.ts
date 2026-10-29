import { useState, useEffect, useCallback } from 'react';
import { listProducts } from '@/db/repositories/product-repository';
import { ProductSelect } from '@/db/schema/products';
import { useSessionStore } from '@/stores/session-store';

export const useProductCatalog = (category?: string, query?: string) => {
  const storeId = useSessionStore((state) => state.currentUser?.storeId ?? 'DEMO-1001');
  const [products, setProducts] = useState<ProductSelect[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await listProducts(storeId, category, query);
      setProducts(result);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [storeId, category, query]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    isLoading,
    refreshCatalog: loadProducts,
  };
};
