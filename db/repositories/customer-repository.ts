import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../client';
import { customers, CustomerSelect, CustomerInsert } from '../schema/customers';
import { creditEntries, CreditEntrySelect, CreditEntryInsert } from '../schema/credit-entries';
import { syncOutbox } from '../schema/sync-outbox';
import { generateUuid } from '@/utils/uuid';

export const listCustomers = async (storeId: string): Promise<CustomerSelect[]> => {
  return db.select().from(customers).where(eq(customers.storeId, storeId));
};

export const getCustomerById = async (id: string): Promise<CustomerSelect | undefined> => {
  const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  return result[0];
};

export const upsertCustomer = async (
  data: CustomerInsert,
  enqueueSync: boolean = true
): Promise<void> => {
  await db.transaction(async (tx) => {
    await tx.insert(customers).values(data).onConflictDoUpdate({
      target: customers.id,
      set: {
        name: sql`excluded.name`,
        phone: sql`excluded.phone`,
        creditBalanceCents: sql`excluded.credit_balance_cents`,
      },
    });

    if (enqueueSync) {
      await tx.insert(syncOutbox).values({
        id: generateUuid(),
        storeId: data.storeId,
        entityType: 'CUSTOMER',
        entityId: data.id,
        payloadJson: JSON.stringify(data),
        status: 'pending',
        retryCount: 0,
        createdAt: Date.now(),
      });
    }
  });
};

export const getCustomerCreditEntries = async (
  customerId: string
): Promise<CreditEntrySelect[]> => {
  return db
    .select()
    .from(creditEntries)
    .where(eq(creditEntries.customerId, customerId))
    .orderBy(desc(creditEntries.createdAt));
};

export const recordCustomerCreditPayment = async (
  entry: CreditEntryInsert,
  enqueueSync: boolean = true
): Promise<void> => {
  await db.transaction(async (tx) => {
    await tx.insert(creditEntries).values(entry);
    const balanceChange = entry.entryType === 'CREDIT' ? -entry.amountCents : entry.amountCents;
    await tx
      .update(customers)
      .set({
        creditBalanceCents: sql`${customers.creditBalanceCents} + ${balanceChange}`,
      })
      .where(eq(customers.id, entry.customerId));

    if (enqueueSync) {
      await tx.insert(syncOutbox).values({
        id: generateUuid(),
        storeId: entry.storeId,
        entityType: 'CUSTOMER_PAYMENT',
        entityId: entry.id,
        payloadJson: JSON.stringify(entry),
        status: 'pending',
        retryCount: 0,
        createdAt: Date.now(),
      });
    }
  });
};
