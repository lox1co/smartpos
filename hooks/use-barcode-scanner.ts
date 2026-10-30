import { useCallback } from 'react';
import { useSessionStore } from '@/stores/session-store';
import { useCartStore } from '@/stores/cart-store';
import { getProductBySku } from '@/db/repositories/product-repository';
import { ProductSelect } from '@/db/schema/products';

export const useBarcodeScanner = () => {
  const storeId = useSessionStore((state) => state.currentUser?.storeId ?? 'DEMO-1001');
  const addItem = useCartStore((state) => state.addItem);

  const lookupProduct = useCallback(
    async (sku: string): Promise<ProductSelect | undefined> => {
      return getProductBySku(storeId, sku);
    },
    [storeId]
  );

  const addScannedProductToCart = useCallback(
    (product: ProductSelect) => {
      addItem(product, 1);
    },
    [addItem]
  );

  return {
    lookupProduct,
    addScannedProductToCart,
  };
};
