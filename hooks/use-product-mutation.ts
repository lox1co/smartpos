import { useState, useCallback } from 'react';
import { useSessionStore } from '@/stores/session-store';
import {
  getProductById,
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
  category: string;
  unit: string;
  taxRate: number;
}

export const useProductMutation = () => {
  const storeId = useSessionStore((state) => state.currentUser?.storeId ?? 'DEMO-1001');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProduct = useCallback(async (id: string): Promise<ProductSelect | undefined> => {
    return getProductById(id);
  }, []);

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
            lowStockAlert: 5,
            category: input.category,
            unit: input.unit.trim() || 'pcs',
            taxRate: input.taxRate,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          },
        ]);
        return productId;
      } finally {
        setIsSubmitting(false);
      }
    },
    [storeId]
  );

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    await deleteProductById(id);
  }, []);

  return {
    isSubmitting,
    fetchProduct,
    saveProduct,
    deleteProduct,
  };
};
