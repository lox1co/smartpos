import { API_BASE_URL } from '@/constants/config';
import { upsertProducts } from '@/db/repositories/product-repository';
import { ProductInsert } from '@/db/schema/products';
import { toCents } from '@/utils/money';

interface RemoteProduct {
  id: number | string;
  store_id: string;
  name: string;
  sku: string;
  price: string | number;
  cost_price: string | number;
  stock: string | number;
  low_stock_alert: string | number;
  category: string;
  unit: string | null;
  tax_rate: string | number;
  image: string | null;
  is_active: boolean | number;
}

export const syncCatalogFromServer = async (token: string): Promise<number> => {
  if (!token) return 0;

  const response = await fetch(`${API_BASE_URL}/api/products`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch catalog: ${response.status}`);
  }

  const rawList: RemoteProduct[] = await response.json();
  const now = Date.now();

  const mapped: ProductInsert[] = rawList.map((p) => ({
    id: String(p.id),
    storeId: String(p.store_id),
    name: p.name,
    sku: p.sku,
    priceCents: toCents(typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0),
    costPriceCents: toCents(
      typeof p.cost_price === 'number' ? p.cost_price : parseFloat(p.cost_price) || 0
    ),
    stock: typeof p.stock === 'number' ? p.stock : parseFloat(p.stock) || 0,
    lowStockAlert:
      typeof p.low_stock_alert === 'number'
        ? p.low_stock_alert
        : parseFloat(p.low_stock_alert) || 5,
    category: p.category,
    unit: p.unit || 'pcs',
    taxRate: typeof p.tax_rate === 'number' ? p.tax_rate : parseFloat(p.tax_rate) || 0,
    image: p.image || null,
    isActive: Boolean(p.is_active),
    createdAt: now,
    updatedAt: now,
  }));

  await upsertProducts(mapped);
  return mapped.length;
};
