import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const creditEntries = sqliteTable(
  'credit_entries',
  {
    id: text('id').primaryKey(),
    storeId: text('store_id').notNull(),
    customerId: text('customer_id').notNull(),
    entryType: text('entry_type').notNull(),
    amountCents: integer('amount_cents').notNull(),
    note: text('note'),
    invoiceNumber: text('invoice_number'),
    createdAt: integer('created_at').notNull(),
  },
  (table) => ({
    customerCreatedIdx: index('idx_credit_customer_created').on(table.customerId, table.createdAt),
  })
);

export type CreditEntrySelect = typeof creditEntries.$inferSelect;
export type CreditEntryInsert = typeof creditEntries.$inferInsert;
