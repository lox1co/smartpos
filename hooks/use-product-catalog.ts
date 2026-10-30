import { useState, useEffect, useCallback } from 'react';
import { listProducts } from '@/db/repositories/product-repository';
import { ProductSelect } from '@/db/schema/products';
import { useSessionStore } from '@/stores/session-store';
import { useDataEventStore } from '@/stores/data-event-store';

export const useProductCatalog = (category?: string, query?: string) => {
  const storeId = useSessionStore((state) => state.currentUser?.storeId ?? 'DEMO-1001');
  const productsVersion = useDataEventStore((state) => state.productsVersion);
  const [products, setProducts] = useState<ProductSelect[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCatalog = useCallback(async () => {
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
    let isMounted = true;
    const execute = async () => {
      try {
        const result = await listProducts(storeId, category, query);
        if (isMounted) setProducts(result);
      } catch {
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    void execute();
    return () => {
      isMounted = false;
    };
  }, [storeId, category, query, productsVersion]);

  return {
    products,
    isLoading,
    refreshCatalog,
  };
};
