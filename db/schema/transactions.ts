import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const transactions = sqliteTable(
  'transactions',
  {
    id: text('id').primaryKey(),
    storeId: text('store_id').notNull(),
    invoiceNumber: text('invoice_number').notNull(),
    userId: text('user_id'),
    customerId: text('customer_id'),
    customerName: text('customer_name'),
    customerPhone: text('customer_phone'),
    paymentMethod: text('payment_method').notNull().default('CASH'),
    paymentStatus: text('payment_status').notNull().default('PAID'),
    subtotalCents: integer('subtotal_cents').notNull(),
    discountCents: integer('discount_cents').notNull().default(0),
    taxCents: integer('tax_cents').notNull().default(0),
    totalCents: integer('total_cents').notNull(),
    amountPaidCents: integer('amount_paid_cents'),
    changeDueCents: integer('change_due_cents'),
    createdAt: integer('created_at').notNull(),
    isPendingSync: integer('is_pending_sync', { mode: 'boolean' }).notNull().default(false),
  },
  (table) => ({
    storeInvoiceIdx: index('idx_tx_store_invoice').on(table.storeId, table.invoiceNumber),
    storeCreatedAtIdx: index('idx_tx_store_created_at').on(table.storeId, table.createdAt),
  })
);

export type TransactionSelect = typeof transactions.$inferSelect;
export type TransactionInsert = typeof transactions.$inferInsert;
