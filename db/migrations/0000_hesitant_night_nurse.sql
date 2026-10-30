CREATE TABLE IF NOT EXISTS `products` (
	`id` text PRIMARY KEY NOT NULL,
	`store_id` text NOT NULL,
	`sku` text NOT NULL,
	`name` text NOT NULL,
	`price_cents` integer NOT NULL,
	`cost_price_cents` integer NOT NULL,
	`stock` real DEFAULT 0 NOT NULL,
	`low_stock_alert` real DEFAULT 5 NOT NULL,
	`category` text NOT NULL,
	`unit` text DEFAULT 'pcs' NOT NULL,
	`tax_rate` real DEFAULT 0 NOT NULL,
	`image` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_products_store_sku` ON `products` (`store_id`,`sku`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_products_store_category` ON `products` (`store_id`,`category`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_products_name` ON `products` (`name`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`store_id` text NOT NULL,
	`invoice_number` text NOT NULL,
	`user_id` text,
	`customer_id` text,
	`customer_name` text,
	`customer_phone` text,
	`payment_method` text DEFAULT 'CASH' NOT NULL,
	`payment_status` text DEFAULT 'PAID' NOT NULL,
	`subtotal_cents` integer NOT NULL,
	`discount_cents` integer DEFAULT 0 NOT NULL,
	`tax_cents` integer DEFAULT 0 NOT NULL,
	`total_cents` integer NOT NULL,
	`amount_paid_cents` integer,
	`change_due_cents` integer,
	`created_at` integer NOT NULL,
	`is_pending_sync` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_tx_store_invoice` ON `transactions` (`store_id`,`invoice_number`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_tx_store_created_at` ON `transactions` (`store_id`,`created_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `transaction_items` (
	`id` text PRIMARY KEY NOT NULL,
	`transaction_id` text NOT NULL,
	`product_id` text,
	`product_name` text NOT NULL,
	`quantity` real NOT NULL,
	`price_cents` integer NOT NULL,
	`total_cents` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_tx_items_tx_id` ON `transaction_items` (`transaction_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`store_id` text NOT NULL,
	`name` text NOT NULL,
	`phone` text,
	`credit_balance_cents` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_customers_store_name` ON `customers` (`store_id`,`name`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `credit_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`store_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`entry_type` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`note` text,
	`invoice_number` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_credit_customer_created` ON `credit_entries` (`customer_id`,`created_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `sync_outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`store_id` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`payload_json` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`retry_count` integer DEFAULT 0 NOT NULL,
	`last_error` text,
	`created_at` integer NOT NULL,
	`synced_at` integer
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_sync_outbox_status` ON `sync_outbox` (`store_id`,`status`);