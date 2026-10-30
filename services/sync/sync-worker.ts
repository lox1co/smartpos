import { API_BASE_URL } from '@/constants/config';
import {
  getPendingOutboxEntries,
  markOutboxSyncing,
  markOutboxSynced,
  markOutboxFailed,
  countPendingOutbox,
  purgeOldSyncedOutbox,
} from '@/db/repositories/sync-outbox-repository';
import { runDatabaseOptimization } from '@/db/repositories/maintenance-repository';
import { fromCents } from '@/utils/money';
import { useSyncStore } from '@/stores/sync-store';
import { TransactionInsert } from '@/db/schema/transactions';
import { TransactionItemInsert } from '@/db/schema/transaction-items';
import { ProductInsert } from '@/db/schema/products';
import { CustomerInsert } from '@/db/schema/customers';
import { CreditEntryInsert } from '@/db/schema/credit-entries';

interface StoredTransactionPayload {
  transaction: TransactionInsert;
  items: TransactionItemInsert[];
}

interface StoredProductDeletePayload {
  id: string;
  sku?: string;
}

let syncTimer: ReturnType<typeof setInterval> | null = null;
let isFlushing = false;
let activeStoreId: string | null = null;
let activeToken: string | null = null;

export const processSyncOutbox = async (storeId: string, token: string): Promise<void> => {
  if (isFlushing || !token || !storeId) return;

  const isOnline = useSyncStore.getState().isOnline;
  if (!isOnline) return;

  isFlushing = true;
  useSyncStore.getState().setIsSyncing(true);

  try {
    const pendingList = await getPendingOutboxEntries(storeId, 20);

    for (const entry of pendingList) {
      await markOutboxSyncing(entry.id);

      try {
        if (entry.entityType === 'TRANSACTION') {
          const parsed: StoredTransactionPayload = JSON.parse(entry.payloadJson);
          const bodyPayload = {
            invoice_number: parsed.transaction.invoiceNumber,
            subtotal: fromCents(parsed.transaction.subtotalCents),
            discount: fromCents(parsed.transaction.discountCents ?? 0),
            tax: fromCents(parsed.transaction.taxCents ?? 0),
            total: fromCents(parsed.transaction.totalCents),
            payment_method: parsed.transaction.paymentMethod,
            payment_status: parsed.transaction.paymentStatus,
            customer_name: parsed.transaction.customerName || undefined,
            customer_phone: parsed.transaction.customerPhone || undefined,
            created_at: new Date(parsed.transaction.createdAt).toISOString(),
            items: parsed.items.map((item) => {
              const rawId = Number(item.productId);
              const isValidIntId = Number.isInteger(rawId) && rawId > 0;
              return {
                product_id: isValidIntId ? rawId : null,
                product_name: item.productName,
                quantity: item.quantity,
                price: fromCents(item.priceCents),
              };
            }),
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
        } else if (entry.entityType === 'PRODUCT') {
          const p: ProductInsert = JSON.parse(entry.payloadJson);
          const bodyPayload = {
            name: p.name,
            sku: p.sku,
            price: fromCents(p.priceCents),
            cost_price: fromCents(p.costPriceCents ?? 0),
            stock: p.stock,
            low_stock_alert: p.lowStockAlert ?? 5,
            category: p.category,
            unit: p.unit ?? 'pcs',
            tax_rate: p.taxRate ?? 0,
            image: p.image || undefined,
            is_active: p.isActive,
          };

          const res = await fetch(`${API_BASE_URL}/api/products`, {
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
        } else if (entry.entityType === 'PRODUCT_DELETE') {
          const delPayload: StoredProductDeletePayload = JSON.parse(entry.payloadJson);
          const delTarget = delPayload.sku || delPayload.id;

          const res = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(delTarget)}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 401) {
            await markOutboxFailed(entry.id, 'Unauthorized token');
            break;
          }

          if (!res.ok && res.status !== 404) {
            const errJson: { detail?: string } = await res.json().catch(() => ({}));
            await markOutboxFailed(entry.id, errJson.detail || `Server error: ${res.status}`);
          } else {
            await markOutboxSynced(entry.id);
          }
        } else if (entry.entityType === 'CUSTOMER') {
          const c: CustomerInsert = JSON.parse(entry.payloadJson);
          const bodyPayload = {
            name: c.name,
            phone: c.phone || undefined,
          };

          const res = await fetch(`${API_BASE_URL}/api/customers`, {
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
        } else if (entry.entityType === 'CUSTOMER_PAYMENT') {
          const entryData: CreditEntryInsert = JSON.parse(entry.payloadJson);
          const bodyPayload = {
            amount: fromCents(entryData.amountCents),
            note: entryData.note || 'Payment received',
          };

          const res = await fetch(
            `${API_BASE_URL}/api/customers/${encodeURIComponent(entryData.customerId)}/payment`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(bodyPayload),
            }
          );

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
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Network failure';
        await markOutboxFailed(entry.id, message);
        break;
      }
    }

    const remaining = await countPendingOutbox(storeId);
    useSyncStore.getState().setPendingOutboxCount(remaining);
    useSyncStore.getState().setLastSyncTimestamp(Date.now());

    await purgeOldSyncedOutbox(storeId);
    await runDatabaseOptimization();
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Sync failure';
    useSyncStore.getState().setLastSyncError(errorMsg);
  } finally {
    isFlushing = false;
    useSyncStore.getState().setIsSyncing(false);
  }
};

export const triggerSync = (): void => {
  if (activeStoreId && activeToken) {
    void processSyncOutbox(activeStoreId, activeToken);
  }
};

export const startSyncWorker = (storeId: string, token: string, intervalMs: number = 25000): void => {
  stopSyncWorker();
  activeStoreId = storeId;
  activeToken = token;
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
  activeStoreId = null;
  activeToken = null;
};
