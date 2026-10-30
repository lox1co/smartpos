import { eq, and, like, or, sql } from 'drizzle-orm';
import { db } from '../client';
import { products, ProductSelect, ProductInsert } from '../schema/products';
import { syncOutbox } from '../schema/sync-outbox';
import { generateUuid } from '@/utils/uuid';

export const getProductById = async (id: string): Promise<ProductSelect | undefined> => {
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
};

export const getProductBySku = async (
  storeId: string,
  sku: string
): Promise<ProductSelect | undefined> => {
  const cleanSku = sku.trim().toUpperCase();
  const direct = await db
    .select()
    .from(products)
    .where(and(eq(products.storeId, storeId), eq(products.sku, cleanSku), eq(products.isActive, true)))
    .limit(1);
  if (direct[0]) return direct[0];

  const noZeros = cleanSku.replace(/^0+/, '');
  if (noZeros && noZeros !== cleanSku) {
    const fallback = await db
      .select()
      .from(products)
      .where(and(eq(products.storeId, storeId), eq(products.sku, noZeros), eq(products.isActive, true)))
      .limit(1);
    if (fallback[0]) return fallback[0];
  }

  const byId = await db
    .select()
    .from(products)
    .where(and(eq(products.storeId, storeId), eq(products.id, sku.trim()), eq(products.isActive, true)))
    .limit(1);
  return byId[0];
};

export const listProducts = async (
  storeId: string,
  category?: string,
  query?: string
): Promise<ProductSelect[]> => {
  const conditions = [eq(products.storeId, storeId), eq(products.isActive, true)];

  if (category && category !== 'All Items') {
    conditions.push(eq(products.category, category));
  }

  if (query && query.trim()) {
    const pattern = `%${query.trim()}%`;
    conditions.push(or(like(products.name, pattern), like(products.sku, pattern))!);
  }

  return db.select().from(products).where(and(...conditions));
};

export const upsertProducts = async (
  items: ProductInsert[],
  enqueueSync: boolean = true
): Promise<void> => {
  if (items.length === 0) return;
  await db.transaction(async (tx) => {
    await tx.insert(products).values(items).onConflictDoUpdate({
      target: products.id,
      set: {
        name: sql`excluded.name`,
        priceCents: sql`excluded.price_cents`,
        costPriceCents: sql`excluded.cost_price_cents`,
        stock: sql`excluded.stock`,
        lowStockAlert: sql`excluded.low_stock_alert`,
        category: sql`excluded.category`,
        unit: sql`excluded.unit`,
        taxRate: sql`excluded.tax_rate`,
        image: sql`excluded.image`,
        isActive: sql`excluded.is_active`,
        updatedAt: sql`excluded.updated_at`,
      },
    });

    if (enqueueSync) {
      const now = Date.now();
      for (const item of items) {
        await tx.insert(syncOutbox).values({
          id: generateUuid(),
          storeId: item.storeId,
          entityType: 'PRODUCT',
          entityId: item.id,
          payloadJson: JSON.stringify(item),
          status: 'pending',
          retryCount: 0,
          createdAt: now,
        });
      }
    }
  });
};

export const decrementProductStock = async (id: string, quantity: number): Promise<void> => {
  await db
    .update(products)
    .set({
      stock: sql`${products.stock} - ${quantity}`,
      updatedAt: Date.now(),
    })
    .where(eq(products.id, id));
};

export const restockProductStock = async (id: string, quantity: number): Promise<void> => {
  await db
    .update(products)
    .set({
      stock: sql`${products.stock} + ${quantity}`,
      updatedAt: Date.now(),
    })
    .where(eq(products.id, id));
};

export const deleteProductById = async (id: string): Promise<void> => {
  await db.transaction(async (tx) => {
    const existing = await tx.select().from(products).where(eq(products.id, id)).limit(1);
    await tx
      .update(products)
      .set({
        isActive: false,
        updatedAt: Date.now(),
      })
      .where(eq(products.id, id));

    if (existing[0]) {
      await tx.insert(syncOutbox).values({
        id: generateUuid(),
        storeId: existing[0].storeId,
        entityType: 'PRODUCT_DELETE',
        entityId: id,
        payloadJson: JSON.stringify({ id, sku: existing[0].sku }),
        status: 'pending',
        retryCount: 0,
        createdAt: Date.now(),
      });
    }
  });
};
