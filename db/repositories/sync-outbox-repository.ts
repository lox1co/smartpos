import { eq, and, or, sql, asc, lte } from 'drizzle-orm';
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

export const getPendingSoldQuantitiesByProduct = async (
  storeId: string
): Promise<Record<string, number>> => {
  const entries = await db
    .select({ payloadJson: syncOutbox.payloadJson })
    .from(syncOutbox)
    .where(
      and(
        eq(syncOutbox.storeId, storeId),
        eq(syncOutbox.entityType, 'TRANSACTION'),
        or(eq(syncOutbox.status, 'pending'), eq(syncOutbox.status, 'syncing'))
      )
    );

  const totals: Record<string, number> = {};
  for (const entry of entries) {
    try {
      const parsed = JSON.parse(entry.payloadJson) as {
        items?: { productId?: string | null; quantity?: number }[];
      };
      if (parsed.items && Array.isArray(parsed.items)) {
        for (const item of parsed.items) {
          if (item.productId && typeof item.quantity === 'number') {
            totals[item.productId] = (totals[item.productId] ?? 0) + item.quantity;
          }
        }
      }
    } catch {
      continue;
    }
  }
  return totals;
};

export const purgeOldSyncedOutbox = async (
  storeId: string,
  maxAgeMs: number = 7 * 24 * 60 * 60 * 1000
): Promise<void> => {
  const cutoff = Date.now() - maxAgeMs;
  await db
    .delete(syncOutbox)
    .where(
      and(
        eq(syncOutbox.storeId, storeId),
        eq(syncOutbox.status, 'synced'),
        lte(syncOutbox.syncedAt, cutoff)
      )
    );
};
