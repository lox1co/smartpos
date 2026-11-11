import { z } from 'zod';

export const creditEntrySchema = z.object({
  id: z.string().min(1),
  storeId: z.string().min(1),
  customerId: z.string().min(1),
  entryType: z.enum(['DEBIT', 'CREDIT']),
  amountCents: z.number().int().positive(),
  note: z.string().nullable().optional(),
  invoiceNumber: z.string().nullable().optional(),
  createdAt: z.number().int(),
});

export const customerSchema = z.object({
  id: z.string().min(1),
  storeId: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().nullable().optional(),
  creditBalanceCents: z.number().int().default(0),
  createdAt: z.number().int(),
  entries: z.array(creditEntrySchema).optional(),
});

export type CreditEntry = z.infer<typeof creditEntrySchema>;
export type Customer = z.infer<typeof customerSchema>;
