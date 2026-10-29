import { expoDb } from './client';

export const initializeDatabase = (): void => {
  expoDb.execSync(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      store_id TEXT NOT NULL,
      sku TEXT NOT NULL,
      name TEXT NOT NULL,
      price_cents INTEGER NOT NULL,
      cost_price_cents INTEGER NOT NULL,
      stock REAL NOT NULL DEFAULT 0,
      low_stock_alert REAL NOT NULL DEFAULT 5,
      category TEXT NOT NULL,
      unit TEXT NOT NULL DEFAULT 'pcs',
      tax_rate REAL NOT NULL DEFAULT 0,
      image TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      store_id TEXT NOT NULL,
      invoice_number TEXT NOT NULL,
      user_id TEXT,
      customer_id TEXT,
      customer_name TEXT,
      customer_phone TEXT,
      payment_method TEXT NOT NULL DEFAULT 'CASH',
      payment_status TEXT NOT NULL DEFAULT 'PAID',
      subtotal_cents INTEGER NOT NULL,
      discount_cents INTEGER NOT NULL DEFAULT 0,
      tax_cents INTEGER NOT NULL DEFAULT 0,
      total_cents INTEGER NOT NULL,
      amount_paid_cents INTEGER,
      change_due_cents INTEGER,
      created_at INTEGER NOT NULL,
      is_pending_sync INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS transaction_items (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL,
      product_id TEXT,
      product_name TEXT NOT NULL,
      quantity REAL NOT NULL,
      price_cents INTEGER NOT NULL,
      total_cents INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      store_id TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      credit_balance_cents INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS credit_entries (
      id TEXT PRIMARY KEY,
      store_id TEXT NOT NULL,
      customer_id TEXT NOT NULL,
      entry_type TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      note TEXT,
      invoice_number TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sync_outbox (
      id TEXT PRIMARY KEY,
      store_id TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      retry_count INTEGER NOT NULL DEFAULT 0,
      last_error TEXT,
      created_at INTEGER NOT NULL,
      synced_at INTEGER
    );
  `);
};
