import { useSessionStore } from '@/stores/session-store';
import { UserSession } from '@/schemas/session';
import { API_BASE_URL } from '@/constants/config';

interface StoreUpdatePayload {
  name?: string;
  category?: string;
  phone?: string;
  gst_number?: string;
  address?: string;
  tax_enabled?: boolean;
  tax_rate?: number;
  currency_code?: string;
  currency_symbol?: string;
}

interface UserUpdatePayload {
  name?: string;
  phone?: string;
  email_or_username?: string;
  image?: string;
}

export const updateUserProfile = async (partial: Partial<UserSession>): Promise<void> => {
  const current = useSessionStore.getState().currentUser;
  useSessionStore.getState().updateProfile(partial);

  if (!current?.token) return;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${current.token}`,
  };

  const storePayload: StoreUpdatePayload = {};
  if (partial.shopName !== undefined) storePayload.name = partial.shopName;
  if (partial.shopCategory !== undefined) storePayload.category = partial.shopCategory;
  if (partial.storePhone !== undefined || partial.phone !== undefined) {
    storePayload.phone = partial.storePhone || partial.phone;
  }
  if (partial.gstNumber !== undefined) storePayload.gst_number = partial.gstNumber;
  if (partial.businessAddress !== undefined) storePayload.address = partial.businessAddress;
  if (partial.taxEnabled !== undefined) storePayload.tax_enabled = partial.taxEnabled;
  if (partial.taxRate !== undefined) storePayload.tax_rate = partial.taxRate;
  if (partial.currencyCode !== undefined) storePayload.currency_code = partial.currencyCode;
  if (partial.currencySymbol !== undefined) storePayload.currency_symbol = partial.currencySymbol;

  try {
    if (Object.keys(storePayload).length > 0 && current.storeId) {
      await fetch(`${API_BASE_URL}/api/stores/${current.storeId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(storePayload),
      });
    }

    const userPayload: UserUpdatePayload = {};
    if (partial.userName !== undefined) userPayload.name = partial.userName;
    if (partial.phone !== undefined) userPayload.phone = partial.phone;
    if (partial.email !== undefined) userPayload.email_or_username = partial.email;
    if (partial.image !== undefined) userPayload.image = partial.image;

    if (Object.keys(userPayload).length > 0 && current.id) {
      const res = await fetch(`${API_BASE_URL}/api/users/${current.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(userPayload),
      });
      if (res.ok) {
        const data = (await res.json()) as { id: string | number; name?: string; email_or_username?: string };
        useSessionStore.getState().updateProfile({
          id: data.id.toString(),
          userName: data.name || current.userName,
          email: data.email_or_username || current.email,
        });
      }
    }
  } catch {
    return;
  }
};
