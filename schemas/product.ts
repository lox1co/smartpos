import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().min(1),
  storeId: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  priceCents: z.number().int().nonnegative(),
  costPriceCents: z.number().int().nonnegative(),
  stock: z.number(),
  lowStockAlert: z.number().nonnegative(),
  category: z.string().min(1),
  unit: z.string().default('pcs'),
  taxRate: z.number().min(0).max(100).default(0),
  image: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
});

export const newProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Product = z.infer<typeof productSchema>;
export type NewProduct = z.infer<typeof newProductSchema>;
