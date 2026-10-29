import { eq, and, sql, asc } from 'drizzle-orm';
import { db } from '../client';
import { syncOutbox, SyncOutboxSelect, SyncOutboxInsert } from '../schema/sync-outbox';

export const enqueueOutbox = async (entry: SyncOutboxInsert): Promise<void> => {
  await db.insert(syncOutbox).values(entry);
};

export const getPendingOutboxEntries = async (
  storeId: string,
  limit: number = 20
): Promise<SyncOutboxSelect[]> => {
  return db
    .select()
    .from(syncOutbox)
    .where(and(eq(syncOutbox.storeId, storeId), eq(syncOutbox.status, 'pending')))
    .orderBy(asc(syncOutbox.createdAt))
    .limit(limit);
};

export const markOutboxSyncing = async (id: string): Promise<void> => {
  await db
    .update(syncOutbox)
    .set({ status: 'syncing' })
    .where(eq(syncOutbox.id, id));
};

export const markOutboxSynced = async (id: string): Promise<void> => {
  await db
    .update(syncOutbox)
    .set({ status: 'synced', syncedAt: Date.now() })
    .where(eq(syncOutbox.id, id));
};

export const markOutboxFailed = async (id: string, error: string): Promise<void> => {
  await db
    .update(syncOutbox)
    .set({
      status: 'failed',
      retryCount: sql`${syncOutbox.retryCount} + 1`,
      lastError: error,
    })
    .where(eq(syncOutbox.id, id));
};

export const countPendingOutbox = async (storeId: string): Promise<number> => {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(syncOutbox)
    .where(and(eq(syncOutbox.storeId, storeId), eq(syncOutbox.status, 'pending')));
  return result[0]?.count ?? 0;
};
