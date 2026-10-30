import { eq, desc, sql, and, gte, lte } from 'drizzle-orm';
import { db } from '../client';
import { transactions, TransactionInsert, TransactionSelect } from '../schema/transactions';
import { transactionItems, TransactionItemInsert, TransactionItemSelect } from '../schema/transaction-items';
import { products } from '../schema/products';
import { customers } from '../schema/customers';
import { creditEntries } from '../schema/credit-entries';
import { syncOutbox } from '../schema/sync-outbox';
import { generateUuid } from '@/utils/uuid';

export interface CheckoutInput {
  transaction: TransactionInsert;
  items: TransactionItemInsert[];
}

export interface ReportSummaryResult {
  salesCents: number;
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  creditCents: number;
  orders: number;
  byMethod: Record<string, { count: number; amountCents: number }>;
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

    if (input.transaction.customerId && input.transaction.paymentStatus === 'CREDIT') {
      await tx.insert(creditEntries).values({
        id: generateUuid(),
        storeId: input.transaction.storeId,
        customerId: input.transaction.customerId,
        entryType: 'DEBIT',
        amountCents: input.transaction.totalCents,
        invoiceNumber: input.transaction.invoiceNumber,
        note: 'Credit sale',
        createdAt: Date.now(),
      });

      await tx
        .update(customers)
        .set({
          creditBalanceCents: sql`${customers.creditBalanceCents} + ${input.transaction.totalCents}`,
        })
        .where(eq(customers.id, input.transaction.customerId));
    }

    await tx.insert(syncOutbox).values({
      id: generateUuid(),
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

    const inserted = await tx
      .select()
      .from(transactions)
      .where(eq(transactions.id, input.transaction.id))
      .limit(1);

    if (inserted[0]) {
      return inserted[0];
    }

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

export const getTransactionReportSummary = async (
  storeId: string,
  startMs: number,
  endMs: number
): Promise<ReportSummaryResult> => {
  const totalsPromise = db
    .select({
      salesCents: sql<number>`coalesce(sum(${transactions.totalCents}), 0)`,
      subtotalCents: sql<number>`coalesce(sum(${transactions.subtotalCents}), 0)`,
      discountCents: sql<number>`coalesce(sum(${transactions.discountCents}), 0)`,
      taxCents: sql<number>`coalesce(sum(${transactions.taxCents}), 0)`,
      orders: sql<number>`count(*)`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.storeId, storeId),
        gte(transactions.createdAt, startMs),
        lte(transactions.createdAt, endMs)
      )
    );

  const creditPromise = db
    .select({
      creditCents: sql<number>`coalesce(sum(${transactions.totalCents}), 0)`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.storeId, storeId),
        gte(transactions.createdAt, startMs),
        lte(transactions.createdAt, endMs),
        eq(transactions.paymentStatus, 'CREDIT')
      )
    );

  const byMethodPromise = db
    .select({
      method: transactions.paymentMethod,
      count: sql<number>`count(*)`,
      amountCents: sql<number>`coalesce(sum(${transactions.totalCents}), 0)`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.storeId, storeId),
        gte(transactions.createdAt, startMs),
        lte(transactions.createdAt, endMs)
      )
    )
    .groupBy(transactions.paymentMethod);

  const [totalsRow, creditRow, methodRows] = await Promise.all([
    totalsPromise,
    creditPromise,
    byMethodPromise,
  ]);

  const byMethod: Record<string, { count: number; amountCents: number }> = {};
  for (const m of methodRows) {
    byMethod[m.method || 'OTHER'] = {
      count: Number(m.count),
      amountCents: Number(m.amountCents),
    };
  }

  return {
    salesCents: Number(totalsRow[0]?.salesCents ?? 0),
    subtotalCents: Number(totalsRow[0]?.subtotalCents ?? 0),
    discountCents: Number(totalsRow[0]?.discountCents ?? 0),
    taxCents: Number(totalsRow[0]?.taxCents ?? 0),
    creditCents: Number(creditRow[0]?.creditCents ?? 0),
    orders: Number(totalsRow[0]?.orders ?? 0),
    byMethod,
  };
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
