import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const syncOutbox = sqliteTable(
  'sync_outbox',
  {
    id: text('id').primaryKey(),
    storeId: text('store_id').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    payloadJson: text('payload_json').notNull(),
    status: text('status').notNull().default('pending'),
    retryCount: integer('retry_count').notNull().default(0),
    lastError: text('last_error'),
    createdAt: integer('created_at').notNull(),
    syncedAt: integer('synced_at'),
  },
  (table) => ({
    storeStatusIdx: index('idx_sync_outbox_status').on(table.storeId, table.status),
  })
);

export type SyncOutboxSelect = typeof syncOutbox.$inferSelect;
export type SyncOutboxInsert = typeof syncOutbox.$inferInsert;
