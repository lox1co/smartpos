import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';

export const transactionItems = sqliteTable(
  'transaction_items',
  {
    id: text('id').primaryKey(),
    transactionId: text('transaction_id').notNull(),
    productId: text('product_id'),
    productName: text('product_name').notNull(),
    quantity: real('quantity').notNull(),
    priceCents: integer('price_cents').notNull(),
    totalCents: integer('total_cents').notNull(),
  },
  (table) => ({
    txIdIdx: index('idx_tx_items_tx_id').on(table.transactionId),
  })
);

export type TransactionItemSelect = typeof transactionItems.$inferSelect;
export type TransactionItemInsert = typeof transactionItems.$inferInsert;
