import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const customers = sqliteTable(
  'customers',
  {
    id: text('id').primaryKey(),
    storeId: text('store_id').notNull(),
    name: text('name').notNull(),
    phone: text('phone'),
    creditBalanceCents: integer('credit_balance_cents').notNull().default(0),
    createdAt: integer('created_at').notNull(),
  },
  (table) => ({
    storeCustomerIdx: index('idx_customers_store_name').on(table.storeId, table.name),
  })
);

export type CustomerSelect = typeof customers.$inferSelect;
export type CustomerInsert = typeof customers.$inferInsert;
