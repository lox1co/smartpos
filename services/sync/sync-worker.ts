import { API_BASE_URL } from '@/constants/config';
import {
  getPendingOutboxEntries,
  markOutboxSyncing,
  markOutboxSynced,
  markOutboxFailed,
  countPendingOutbox,
} from '@/db/repositories/sync-outbox-repository';
import { fromCents } from '@/utils/money';
import { useSyncStore } from '@/stores/sync-store';
import { TransactionInsert } from '@/db/schema/transactions';
import { TransactionItemInsert } from '@/db/schema/transaction-items';

interface StoredTransactionPayload {
  transaction: TransactionInsert;
  items: TransactionItemInsert[];
}

let syncTimer: ReturnType<typeof setInterval> | null = null;
let isFlushing = false;

export const processSyncOutbox = async (storeId: string, token: string): Promise<void> => {
  if (isFlushing || !token || !storeId) return;

  isFlushing = true;
  useSyncStore.getState().setIsSyncing(true);

  try {
    const pendingList = await getPendingOutboxEntries(storeId, 20);

    for (const entry of pendingList) {
      await markOutboxSyncing(entry.id);

      if (entry.entityType === 'TRANSACTION') {
        try {
          const parsed: StoredTransactionPayload = JSON.parse(entry.payloadJson);
          const bodyPayload = {
            subtotal: fromCents(parsed.transaction.subtotalCents),
            discount: fromCents(parsed.transaction.discountCents ?? 0),
            tax: fromCents(parsed.transaction.taxCents ?? 0),
            total: fromCents(parsed.transaction.totalCents),
            payment_method: parsed.transaction.paymentMethod,
            payment_status: parsed.transaction.paymentStatus,
            customer_name: parsed.transaction.customerName || undefined,
            customer_phone: parsed.transaction.customerPhone || undefined,
            items: parsed.items.map((item) => ({
              product_id: parseInt(item.productId || '0', 10),
              quantity: item.quantity,
              price: fromCents(item.priceCents),
            })),
          };

          const res = await fetch(`${API_BASE_URL}/api/checkout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(bodyPayload),
          });

          if (res.status === 401) {
            await markOutboxFailed(entry.id, 'Unauthorized token');
            break;
          }

          if (!res.ok) {
            const errJson: { detail?: string } = await res.json().catch(() => ({}));
            await markOutboxFailed(entry.id, errJson.detail || `Server error: ${res.status}`);
          } else {
            await markOutboxSynced(entry.id);
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Network failure';
          await markOutboxFailed(entry.id, message);
          break;
        }
      }
    }

    const remaining = await countPendingOutbox(storeId);
    useSyncStore.getState().setPendingOutboxCount(remaining);
    useSyncStore.getState().setLastSyncTimestamp(Date.now());
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Sync failure';
    useSyncStore.getState().setLastSyncError(errorMsg);
  } finally {
    isFlushing = false;
    useSyncStore.getState().setIsSyncing(false);
  }
};

export const startSyncWorker = (storeId: string, token: string, intervalMs: number = 25000): void => {
  stopSyncWorker();
  void processSyncOutbox(storeId, token);
  syncTimer = setInterval(() => {
    void processSyncOutbox(storeId, token);
  }, intervalMs);
};

export const stopSyncWorker = (): void => {
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = null;
  }
};
