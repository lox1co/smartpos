import { eq, desc, sql, and, gte, lte } from 'drizzle-orm';
import { db } from '../client';
import { transactions, TransactionInsert, TransactionSelect } from '../schema/transactions';
import { transactionItems, TransactionItemInsert, TransactionItemSelect } from '../schema/transaction-items';
import { products } from '../schema/products';
import { syncOutbox } from '../schema/sync-outbox';

export interface CheckoutInput {
  transaction: TransactionInsert;
  items: TransactionItemInsert[];
}

export const executeCheckout = async (input: CheckoutInput): Promise<TransactionSelect> => {
  return db.transaction(async (tx) => {
    await tx.insert(transactions).values(input.transaction);
    if (input.items.length > 0) {
      await tx.insert(transactionItems).values(input.items);
    }
    for (const item of input.items) {
      if (item.productId) {
        await tx
          .update(products)
          .set({
            stock: sql`${products.stock} - ${item.quantity}`,
            updatedAt: Date.now(),
          })
          .where(eq(products.id, item.productId));
      }
    }
    await tx.insert(syncOutbox).values({
      id: `outbox-${input.transaction.id}`,
      storeId: input.transaction.storeId,
      entityType: 'TRANSACTION',
      entityId: input.transaction.id,
      payloadJson: JSON.stringify({
        transaction: input.transaction,
        items: input.items,
      }),
      status: 'pending',
      retryCount: 0,
      createdAt: Date.now(),
    });
    return input.transaction as TransactionSelect;
  });
};

export const listTransactions = async (
  storeId: string,
  limit: number = 100
): Promise<TransactionSelect[]> => {
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.storeId, storeId))
    .orderBy(desc(transactions.createdAt))
    .limit(limit);
};

export const listTransactionsByDateRange = async (
  storeId: string,
  startMs: number,
  endMs: number
): Promise<TransactionSelect[]> => {
  return db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.storeId, storeId),
        gte(transactions.createdAt, startMs),
        lte(transactions.createdAt, endMs)
      )
    )
    .orderBy(desc(transactions.createdAt));
};

export const getTransactionItems = async (
  transactionId: string
): Promise<TransactionItemSelect[]> => {
  return db
    .select()
    .from(transactionItems)
    .where(eq(transactionItems.transactionId, transactionId));
};

export const getTransactionWithItems = async (
  transactionId: string
): Promise<{ transaction: TransactionSelect; items: TransactionItemSelect[] } | null> => {
  const tx = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, transactionId))
    .limit(1);
  if (!tx[0]) return null;
  const items = await db
    .select()
    .from(transactionItems)
    .where(eq(transactionItems.transactionId, transactionId));
  return { transaction: tx[0], items };
};
