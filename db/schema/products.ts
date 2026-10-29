import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable(
  'products',
  {
    id: text('id').primaryKey(),
    storeId: text('store_id').notNull(),
    sku: text('sku').notNull(),
    name: text('name').notNull(),
    priceCents: integer('price_cents').notNull(),
    costPriceCents: integer('cost_price_cents').notNull(),
    stock: real('stock').notNull().default(0),
    lowStockAlert: real('low_stock_alert').notNull().default(5),
    category: text('category').notNull(),
    unit: text('unit').notNull().default('pcs'),
    taxRate: real('tax_rate').notNull().default(0),
    image: text('image'),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => ({
    storeSkuIdx: index('idx_products_store_sku').on(table.storeId, table.sku),
    storeCategoryIdx: index('idx_products_store_category').on(table.storeId, table.category),
    nameIdx: index('idx_products_name').on(table.name),
  })
);

export type ProductSelect = typeof products.$inferSelect;
export type ProductInsert = typeof products.$inferInsert;
