import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../client';
import { customers, CustomerSelect, CustomerInsert } from '../schema/customers';
import { creditEntries, CreditEntrySelect, CreditEntryInsert } from '../schema/credit-entries';

export const listCustomers = async (storeId: string): Promise<CustomerSelect[]> => {
  return db.select().from(customers).where(eq(customers.storeId, storeId));
};

export const getCustomerById = async (id: string): Promise<CustomerSelect | undefined> => {
  const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  return result[0];
};

export const upsertCustomer = async (data: CustomerInsert): Promise<void> => {
  await db.insert(customers).values(data).onConflictDoUpdate({
    target: customers.id,
    set: {
      name: sql`excluded.name`,
      phone: sql`excluded.phone`,
      creditBalanceCents: sql`excluded.credit_balance_cents`,
    },
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
  entry: CreditEntryInsert
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
  });
};
