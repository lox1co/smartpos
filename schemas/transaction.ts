import { z } from 'zod';

export const transactionItemSchema = z.object({
  id: z.string().min(1),
  transactionId: z.string().min(1),
  productId: z.string().nullable().optional(),
  productName: z.string().min(1),
  quantity: z.number().positive(),
  priceCents: z.number().int().nonnegative(),
  totalCents: z.number().int().nonnegative(),
});

export const transactionSchema = z.object({
  id: z.string().min(1),
  storeId: z.string().min(1),
  invoiceNumber: z.string().min(1),
  userId: z.string().nullable().optional(),
  customerId: z.string().nullable().optional(),
  customerName: z.string().nullable().optional(),
  customerPhone: z.string().nullable().optional(),
  paymentMethod: z.enum(['CASH', 'UPI', 'CARD', 'CREDIT']),
  paymentStatus: z.enum(['PAID', 'PENDING', 'CREDIT']),
  subtotalCents: z.number().int().nonnegative(),
  discountCents: z.number().int().nonnegative().default(0),
  taxCents: z.number().int().nonnegative().default(0),
  totalCents: z.number().int().nonnegative(),
  amountPaidCents: z.number().int().nonnegative().nullable().optional(),
  changeDueCents: z.number().int().nonnegative().nullable().optional(),
  createdAt: z.number().int(),
  isPendingSync: z.boolean().default(false),
  items: z.array(transactionItemSchema),
});

export type TransactionItem = z.infer<typeof transactionItemSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
