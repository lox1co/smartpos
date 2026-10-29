import { useState } from 'react';
import { executeCheckout, CheckoutInput } from '@/db/repositories/transaction-repository';
import { countPendingOutbox } from '@/db/repositories/sync-outbox-repository';
import { useCartStore } from '@/stores/cart-store';
import { useSessionStore } from '@/stores/session-store';
import { useSyncStore } from '@/stores/sync-store';
import { TransactionSelect } from '@/db/schema/transactions';

export interface CheckoutOptions {
  paymentMethod: 'CASH' | 'UPI' | 'CARD' | 'CREDIT';
  paymentStatus?: 'PAID' | 'PENDING' | 'CREDIT';
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  amountPaidCents?: number;
}

export const useCheckout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCompletedTx, setLastCompletedTx] = useState<TransactionSelect | null>(null);

  const currentUser = useSessionStore((state) => state.currentUser);
  const clearCart = useCartStore((state) => state.clearCart);
  const setPendingOutboxCount = useSyncStore((state) => state.setPendingOutboxCount);

  const processCheckout = async (options: CheckoutOptions): Promise<TransactionSelect> => {
    setIsProcessing(true);
    try {
      const storeId = currentUser?.storeId ?? 'DEMO-1001';
      const userId = currentUser?.id ?? '1';
      const { items, getTotals } = useCartStore.getState();
      const totals = getTotals(currentUser?.taxEnabled ?? true, currentUser?.taxRate ?? 8);

      const txId = `tx-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const invoiceNumber = `INV-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`;

      const input: CheckoutInput = {
        transaction: {
          id: txId,
          storeId,
          invoiceNumber,
          userId,
          customerId: options.customerId,
          customerName: options.customerName,
          customerPhone: options.customerPhone,
          paymentMethod: options.paymentMethod,
          paymentStatus: options.paymentStatus ?? (options.paymentMethod === 'CREDIT' ? 'CREDIT' : 'PAID'),
          subtotalCents: totals.subtotalCents,
          discountCents: totals.discountCents,
          taxCents: totals.taxCents,
          totalCents: totals.totalCents,
          amountPaidCents: options.amountPaidCents,
          changeDueCents:
            options.amountPaidCents !== undefined
              ? Math.max(0, options.amountPaidCents - totals.totalCents)
              : undefined,
          createdAt: Date.now(),
          isPendingSync: true,
        },
        items: items.map((item) => ({
          id: `item-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          transactionId: txId,
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          priceCents: item.product.priceCents,
          totalCents: Math.round(item.product.priceCents * item.quantity),
        })),
      };

      const result = await executeCheckout(input);
      setLastCompletedTx(result);
      clearCart();

      const pendingCount = await countPendingOutbox(storeId);
      setPendingOutboxCount(pendingCount);

      return result;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    lastCompletedTx,
    processCheckout,
  };
};
