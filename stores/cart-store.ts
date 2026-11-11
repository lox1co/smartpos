import { create } from 'zustand';
import { Product } from '@/schemas/product';
import { CartItem } from '@/schemas/cart';
import { calculateDiscountCents, calculateTaxCents } from '@/utils/money';

interface CartTotals {
  subtotalCents: number;
  discountCents: number;
  taxableSubtotalCents: number;
  taxCents: number;
  totalCents: number;
  totalItemsCount: number;
}

interface CartState {
  items: CartItem[];
  discountPercent: number;
  selectedCategory: string;
  searchQuery: string;
  isCartOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setDiscountPercent: (percent: number) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setIsCartOpen: (open: boolean) => void;
  clearCart: () => void;
  getTotals: (taxEnabled?: boolean, storeTaxRate?: number) => CartTotals;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  discountPercent: 0,
  selectedCategory: 'All Items',
  searchQuery: '',
  isCartOpen: false,

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity }] };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.product.id !== productId) };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        ),
      };
    });
  },

  setDiscountPercent: (discountPercent) => set({ discountPercent: Math.max(0, Math.min(100, discountPercent)) }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setIsCartOpen: (isCartOpen) => set({ isCartOpen }),
  clearCart: () => set({ items: [], discountPercent: 0, isCartOpen: false }),

  getTotals: (taxEnabled = true, storeTaxRate) => {
    const { items, discountPercent } = get();

    let subtotalCents = 0;
    let totalItemsCount = 0;

    for (const item of items) {
      subtotalCents += Math.round(item.product.priceCents * item.quantity);
      totalItemsCount += ['kg', 'g', 'l', 'ml'].includes(item.product.unit) ? 1 : item.quantity;
    }

    const discountCents = calculateDiscountCents(subtotalCents, discountPercent);
    const taxableSubtotalCents = Math.max(0, subtotalCents - discountCents);
    const discountRatio = subtotalCents > 0 ? taxableSubtotalCents / subtotalCents : 0;

    let taxCents = 0;
    if (taxEnabled && subtotalCents > 0) {
      for (const item of items) {
        const lineCents = Math.round(item.product.priceCents * item.quantity * discountRatio);
        const rate = storeTaxRate !== undefined ? storeTaxRate : item.product.taxRate;
        taxCents += calculateTaxCents(lineCents, rate);
      }
    }

    const totalCents = taxableSubtotalCents + taxCents;

    return {
      subtotalCents,
      discountCents,
      taxableSubtotalCents,
      taxCents,
      totalCents,
      totalItemsCount,
    };
  },
}));
