import { z } from 'zod';

export const syncOutboxStatusSchema = z.enum(['pending', 'syncing', 'failed', 'synced']);

export const syncOutboxSchema = z.object({
  id: z.string().min(1),
  storeId: z.string().min(1),
  entityType: z.enum(['TRANSACTION', 'PRODUCT', 'CUSTOMER_PAYMENT']),
  entityId: z.string().min(1),
  payloadJson: z.string().min(1),
  status: syncOutboxStatusSchema.default('pending'),
  retryCount: z.number().int().nonnegative().default(0),
  lastError: z.string().nullable().optional(),
  createdAt: z.number().int(),
  syncedAt: z.number().int().nullable().optional(),
});

export type SyncOutboxStatus = z.infer<typeof syncOutboxStatusSchema>;
export type SyncOutbox = z.infer<typeof syncOutboxSchema>;
