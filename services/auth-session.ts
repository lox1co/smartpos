import { useSessionStore } from '@/stores/session-store';
import { loginResponseSchema, type UserSession } from '@/schemas/session';

export const syncUserSession = async (payload: unknown): Promise<void> => {
  const data = loginResponseSchema.parse(payload);
  const session: UserSession = {
    id: data.id,
    storeId: data.store_id,
    userName: data.name,
    role: data.role ?? 'owner',
    shopName: data.shop_name ?? 'SmartPOS Store',
    shopCategory: data.shop_category ?? 'Retail',
    phone: data.phone ?? '',
    email: data.email_or_username,
    image: data.image,
    gstNumber: data.gst_number,
    businessAddress: data.business_address,
    storePhone: data.store_phone ?? data.phone,
    taxEnabled: data.tax_enabled ?? true,
    taxRate: data.tax_rate ?? 8,
    currencyCode: data.currency_code ?? 'USD',
    currencySymbol: data.currency_symbol ?? '$',
    token: data.token,
  };

  useSessionStore.getState().setSession(session);
};
