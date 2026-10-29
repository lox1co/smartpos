import { useMemo } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { useSessionStore } from '@/stores/session-store';
import { Product } from '@/schemas/product';

export const useCart = () => {
  const items = useCartStore((state) => state.items);
  const discountPercent = useCartStore((state) => state.discountPercent);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const selectedCategory = useCartStore((state) => state.selectedCategory);
  const searchQuery = useCartStore((state) => state.searchQuery);

  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const setDiscountPercent = useCartStore((state) => state.setDiscountPercent);
  const setSelectedCategory = useCartStore((state) => state.setSelectedCategory);
  const setSearchQuery = useCartStore((state) => state.setSearchQuery);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotals = useCartStore((state) => state.getTotals);

  const taxEnabled = useSessionStore((state) => state.currentUser?.taxEnabled ?? true);
  const taxRate = useSessionStore((state) => state.currentUser?.taxRate ?? 8);
  const currencySymbol = useSessionStore((state) => state.currentUser?.currencySymbol ?? '$');

  const totals = useMemo(() => {
    return getTotals(taxEnabled, taxRate);
  }, [getTotals, items, discountPercent, taxEnabled, taxRate]);

  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of items) {
      map[item.product.id] = item.quantity;
    }
    return map;
  }, [items]);

  const canAddToCart = (product: Product): boolean => {
    const inCart = cartQuantities[product.id] ?? 0;
    return product.stock > inCart;
  };

  return {
    items,
    discountPercent,
    isCartOpen,
    selectedCategory,
    searchQuery,
    totals,
    cartQuantities,
    currencySymbol,
    addItem,
    removeItem,
    updateQuantity,
    setDiscountPercent,
    setSelectedCategory,
    setSearchQuery,
    setIsCartOpen,
    clearCart,
    canAddToCart,
  };
};
