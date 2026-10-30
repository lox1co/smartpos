import { and, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { db } from '../client';
import { transactions } from '../schema/transactions';
import { transactionItems } from '../schema/transaction-items';
import { products } from '../schema/products';

export interface DashboardStockAlert {
  id: string;
  name: string;
  stock: number;
  unit: string;
}

export interface DashboardRecentTx {
  id: string;
  invoiceNumber: string;
  paymentMethod: string;
  totalCents: number;
  itemsCount: number;
  createdAt: number;
}

export interface DashboardTrendItem {
  day: string;
  date: string;
  amountCents: number;
}

export interface DashboardMetrics {
  todaySalesCents: number;
  yesterdaySalesCents: number;
  salesGrowthPercentage: number;
  ordersCount: number;
  profitCents: number;
  lowStockAlerts: DashboardStockAlert[];
  recentTransactions: DashboardRecentTx[];
  weeklyTrend: DashboardTrendItem[];
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const getDashboardMetrics = async (storeId: string): Promise<DashboardMetrics> => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();

  const startOfYesterday = startOfToday - 86400000;
  const endOfYesterday = startOfToday - 1;

  const todaySummaryPromise = db
    .select({
      totalCents: sql<number>`coalesce(sum(${transactions.totalCents}), 0)`,
      discountCents: sql<number>`coalesce(sum(${transactions.discountCents}), 0)`,
      ordersCount: sql<number>`count(*)`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.storeId, storeId),
        gte(transactions.createdAt, startOfToday),
        lte(transactions.createdAt, endOfToday)
      )
    );

  const yesterdaySummaryPromise = db
    .select({
      totalCents: sql<number>`coalesce(sum(${transactions.totalCents}), 0)`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.storeId, storeId),
        gte(transactions.createdAt, startOfYesterday),
        lte(transactions.createdAt, endOfYesterday)
      )
    );

  const lowStockPromise = db
    .select({
      id: products.id,
      name: products.name,
      stock: products.stock,
      unit: products.unit,
    })
    .from(products)
    .where(
      and(
        eq(products.storeId, storeId),
        eq(products.isActive, true),
        sql`${products.stock} <= ${products.lowStockAlert}`
      )
    )
    .orderBy(products.stock)
    .limit(5);

  const recentTxPromise = db
    .select({
      id: transactions.id,
      invoiceNumber: transactions.invoiceNumber,
      paymentMethod: transactions.paymentMethod,
      totalCents: transactions.totalCents,
      createdAt: transactions.createdAt,
      itemsCount: sql<number>`coalesce((select sum(quantity) from ${transactionItems} where ${transactionItems.transactionId} = ${transactions.id}), 0)`,
    })
    .from(transactions)
    .where(eq(transactions.storeId, storeId))
    .orderBy(desc(transactions.createdAt))
    .limit(5);

  const profitPromise = db
    .select({
      grossProfit: sql<number>`coalesce(sum(${transactionItems.quantity} * (${transactionItems.priceCents} - coalesce(${products.costPriceCents}, 0))), 0)`,
    })
    .from(transactionItems)
    .innerJoin(transactions, eq(transactions.id, transactionItems.transactionId))
    .leftJoin(products, eq(products.id, transactionItems.productId))
    .where(
      and(
        eq(transactions.storeId, storeId),
        gte(transactions.createdAt, startOfToday),
        lte(transactions.createdAt, endOfToday)
      )
    );

  const [todaySummary, yesterdaySummary, lowStockProducts, recentTxRows, profitRows] =
    await Promise.all([
      todaySummaryPromise,
      yesterdaySummaryPromise,
      lowStockPromise,
      recentTxPromise,
      profitPromise,
    ]);

  const todaySalesCents = Number(todaySummary[0]?.totalCents ?? 0);
  const todayDiscountCents = Number(todaySummary[0]?.discountCents ?? 0);
  const ordersCount = Number(todaySummary[0]?.ordersCount ?? 0);
  const yesterdaySalesCents = Number(yesterdaySummary[0]?.totalCents ?? 0);

  let salesGrowthPercentage = 0;
  if (yesterdaySalesCents > 0) {
    salesGrowthPercentage = Number(
      (((todaySalesCents - yesterdaySalesCents) / yesterdaySalesCents) * 100).toFixed(1)
    );
  } else if (todaySalesCents > 0) {
    salesGrowthPercentage = 100;
  }

  const grossProfitCents = Number(profitRows[0]?.grossProfit ?? 0);
  const profitCents = Math.max(0, grossProfitCents - todayDiscountCents);

  const weeklyTrend: DashboardTrendItem[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = startOfToday - i * 86400000;
    const dayEnd = dayStart + 86400000 - 1;
    const dateObj = new Date(dayStart);
    const dayLabel = DAY_LABELS[dateObj.getDay()] ?? 'Day';
    const dateStr = dateObj.toISOString().slice(0, 10);

    const trendRow = await db
      .select({
        totalCents: sql<number>`coalesce(sum(${transactions.totalCents}), 0)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.storeId, storeId),
          gte(transactions.createdAt, dayStart),
          lte(transactions.createdAt, dayEnd)
        )
      );

    weeklyTrend.push({
      day: dayLabel,
      date: dateStr,
      amountCents: Number(trendRow[0]?.totalCents ?? 0),
    });
  }

  return {
    todaySalesCents,
    yesterdaySalesCents,
    salesGrowthPercentage,
    ordersCount,
    profitCents,
    lowStockAlerts: lowStockProducts.map((p) => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      unit: p.unit,
    })),
    recentTransactions: recentTxRows.map((tx) => ({
      id: tx.id,
      invoiceNumber: tx.invoiceNumber,
      paymentMethod: tx.paymentMethod,
      totalCents: tx.totalCents,
      itemsCount: Number(tx.itemsCount),
      createdAt: tx.createdAt,
    })),
    weeklyTrend,
  };
};
