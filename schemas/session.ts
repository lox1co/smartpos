import { z } from 'zod';

export const userSessionSchema = z.object({
  id: z.string().min(1),
  storeId: z.string().min(1),
  userName: z.string().min(1),
  role: z.enum(['owner', 'manager', 'cashier']).default('cashier'),
  shopName: z.string().default('SmartPOS Store'),
  shopCategory: z.string().default('Retail'),
  phone: z.string().default(''),
  email: z.string().default(''),
  image: z.string().optional(),
  gstNumber: z.string().optional(),
  businessAddress: z.string().optional(),
  storePhone: z.string().optional(),
  taxEnabled: z.boolean().default(true),
  taxRate: z.number().nonnegative().default(8),
  currencyCode: z.string().default('USD'),
  currencySymbol: z.string().default('$'),
  token: z.string().optional(),
});

export type UserSession = z.infer<typeof userSessionSchema>;

const optionalText = z
  .string()
  .nullish()
  .transform((value) => value || undefined);

export const loginResponseSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  store_id: z.union([z.string(), z.number()]).transform(String),
  name: z.string().min(1),
  role: z.enum(['owner', 'manager', 'cashier']).nullish(),
  shop_name: optionalText,
  shop_category: optionalText,
  phone: optionalText,
  email_or_username: z.string(),
  image: optionalText,
  gst_number: optionalText,
  business_address: optionalText,
  store_phone: optionalText,
  tax_enabled: z.boolean().nullish(),
  tax_rate: z.coerce.number().nonnegative().nullish(),
  currency_code: optionalText,
  currency_symbol: optionalText,
  token: z.string().min(1),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
