import { useState, useCallback } from 'react';
import { useSessionStore } from '@/stores/session-store';
import { useDataEventStore } from '@/stores/data-event-store';
import {
  getProductById,
  getProductBySku,
  upsertProducts,
  deleteProductById,
} from '@/db/repositories/product-repository';
import { ProductSelect } from '@/db/schema/products';
import { toCents } from '@/utils/money';
import { generateUuid } from '@/utils/uuid';

export interface ProductSaveInput {
  id?: string;
  name: string;
  sku: string;
  price: number;
  costPrice: number;
  stock: number;
  lowStockAlert?: number;
  category: string;
  unit: string;
  taxRate: number;
  image?: string | null;
}

export const useProductMutation = () => {
  const storeId = useSessionStore((state) => state.currentUser?.storeId ?? 'DEMO-1001');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProduct = useCallback(async (id: string): Promise<ProductSelect | undefined> => {
    return getProductById(id);
  }, []);

  const checkSkuAvailable = useCallback(
    async (sku: string, currentProductId?: string): Promise<boolean> => {
      const existing = await getProductBySku(storeId, sku);
      if (!existing) return true;
      if (currentProductId && existing.id === currentProductId) return true;
      return false;
    },
    [storeId]
  );

  const saveProduct = useCallback(
    async (input: ProductSaveInput): Promise<string> => {
      setIsSubmitting(true);
      try {
        const now = Date.now();
        const productId = input.id || generateUuid();

        await upsertProducts([
          {
            id: productId,
            storeId,
            sku: input.sku.trim().toUpperCase(),
            name: input.name.trim(),
            priceCents: toCents(input.price),
            costPriceCents: toCents(input.costPrice),
            stock: input.stock,
            lowStockAlert: input.lowStockAlert !== undefined ? input.lowStockAlert : 5,
            category: input.category,
            unit: input.unit.trim() || 'pcs',
            taxRate: input.taxRate,
            image: input.image ? input.image.trim() : null,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          },
        ]);

        useDataEventStore.getState().notifyProductMutation();
        return productId;
      } finally {
        setIsSubmitting(false);
      }
    },
    [storeId]
  );

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    await deleteProductById(id);
    useDataEventStore.getState().notifyProductMutation();
  }, []);

  return {
    isSubmitting,
    fetchProduct,
    checkSkuAvailable,
    saveProduct,
    deleteProduct,
  };
};
