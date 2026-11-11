import { useSessionStore } from '@/stores/session-store';

export interface BillItem {
  id?: number | string;
  product_id?: number | string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface GeneratedBill {
  store_id: string;
  invoice_number: string;
  shop_name: string;
  shop_address?: string;
  shop_phone?: string;
  gst_number?: string;
  cashier_name?: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
  customer_credit_balance?: number;
  amount_paid?: number;
  change_due?: number;
  pending?: boolean;
  client_id?: string;
  items: BillItem[];
}

export function gstSplit(tax: number): { cgst: number; sgst: number } {
  const safe = tax || 0;
  const half = Math.round((safe / 2) * 100) / 100;
  return { cgst: half, sgst: Math.round((safe - half) * 100) / 100 };
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const pad2 = (n: number) => String(n).padStart(2, '0');

export function formatBillDate(iso?: string | Date): string {
  if (!iso) return '';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (isNaN(d.getTime())) return String(iso);
  let hours = d.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${pad2(d.getDate())} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}, ${pad2(hours)}:${pad2(d.getMinutes())} ${ampm}`;
}

function formatReceiptDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return iso;
  }
}

export interface ReceiptOptions {
  currency?: string;
  footerMessage?: string;
}

export function buildReceiptHtml(bill: GeneratedBill, opts: ReceiptOptions = {}): string {
  const currency = opts.currency ?? useSessionStore.getState().currentUser?.currencySymbol ?? '$';
  const money = (n: number) => `${currency}${(n || 0).toFixed(2)}`;
  const hasGst = Boolean(bill.gst_number && String(bill.gst_number).trim());

  const itemRows = (bill.items || [])
    .map((it) => {
      const lineTotal = (it.price || 0) * (it.quantity || 0);
      return `
        <tr>
          <td class="name">${escapeHtml(it.product_name)}</td>
          <td class="num">${it.quantity ?? 0}</td>
          <td class="num">${money(it.price)}</td>
          <td class="num bold">${money(lineTotal)}</td>
        </tr>`;
    })
    .join('');

  const split = gstSplit(bill.tax);
  const gstRows =
    bill.tax > 0
      ? `
        <div class="row muted">
          <span>CGST</span>
          <span>${money(split.cgst)}</span>
        </div>
        <div class="row muted">
          <span>SGST</span>
          <span>${money(split.sgst)}</span>
        </div>`
      : '';

  const discountRow =
    (bill.discount || 0) > 0
      ? `
        <div class="row discount">
          <span>Discount</span>
          <span>-${money(bill.discount)}</span>
        </div>`
      : '';

  const cashDetails =
    bill.payment_method === 'CASH' && bill.amount_paid !== undefined
      ? `
        <div class="row muted">
          <span>Cash Tendered</span>
          <span>${money(bill.amount_paid)}</span>
        </div>
        <div class="row muted">
          <span>Change Due</span>
          <span>${money(bill.change_due ?? 0)}</span>
        </div>`
      : '';

  const creditDetails =
    bill.payment_method === 'CREDIT'
      ? `
        <div class="row credit-alert">
          <span>Balance Added to Khata</span>
          <span>${money(bill.total)}</span>
        </div>
        ${
          bill.customer_credit_balance !== undefined
            ? `
        <div class="row credit-alert bold">
          <span>Total Balance Due</span>
          <span>${money(bill.customer_credit_balance)}</span>
        </div>`
            : ''
        }`
      : '';

  const customerBlock =
    bill.customer_name || bill.customer_phone
      ? `
        <div class="section customer">
          <div class="section-title">Customer</div>
          ${bill.customer_name ? `<div>${escapeHtml(bill.customer_name)}</div>` : ''}
          ${bill.customer_phone ? `<div>${escapeHtml(bill.customer_phone)}</div>` : ''}
        </div>`
      : '';

  const footer = escapeHtml(opts.footerMessage || 'Thank you for your visit!');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Receipt ${escapeHtml(bill.invoice_number)}</title>
<style>
  * { box-sizing: border-box; }
  @page { margin: 4mm; size: auto; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, monospace;
    font-size: 11px;
    line-height: 1.35;
    color: #000;
    background: #fff;
    margin: 0 auto;
    padding: 8px 6px 16px 6px;
    max-width: 320px;
  }
  .center { text-align: center; }
  .bold { font-weight: 700; }
  .muted { color: #555; }
  .shop-name { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
  .meta { font-size: 10px; margin-top: 2px; }
  .divider { border-top: 1px dashed #000; margin: 8px 0; }
  .double-divider { border-top: 2px solid #000; margin: 8px 0; }
  .section { margin-bottom: 6px; }
  .section-title { font-size: 9px; text-transform: uppercase; font-weight: 700; color: #555; margin-bottom: 2px; }
  .row { display: flex; justify-content: space-between; align-items: baseline; margin: 2px 0; }
  .row.total { font-size: 14px; font-weight: 800; margin: 4px 0; }
  .row.discount { color: #000; font-weight: 600; }
  .row.credit-alert { color: #000; }
  table.items { width: 100%; border-collapse: collapse; margin: 4px 0; font-size: 10.5px; }
  table.items th {
    font-size: 9px;
    text-transform: uppercase;
    border-bottom: 1px dashed #000;
    padding: 3px 0;
    font-weight: 700;
  }
  table.items td { padding: 3px 0; vertical-align: top; }
  table.items td.name { text-align: left; word-break: break-word; }
  table.items td.num, table.items th.num { text-align: right; white-space: nowrap; }
  table.items th:first-child, table.items td:first-child { width: 45%; }
  table.items th:nth-child(2), table.items td:nth-child(2) { width: 15%; }
  table.items th:nth-child(3), table.items td:nth-child(3) { width: 20%; }
  table.items th:last-child, table.items td:last-child { width: 20%; }
  .footer { margin-top: 12px; font-size: 10px; }
</style>
</head>
<body>
  <div class="center section">
    <div class="shop-name">${escapeHtml(bill.shop_name || 'SmartPOS')}</div>
    ${bill.shop_address ? `<div class="meta">${escapeHtml(bill.shop_address)}</div>` : ''}
    ${bill.shop_phone ? `<div class="meta">Ph: ${escapeHtml(bill.shop_phone)}</div>` : ''}
    ${hasGst ? `<div class="meta bold">GSTIN: ${escapeHtml(bill.gst_number)}</div>` : ''}
  </div>

  <div class="divider"></div>

  <div class="section">
    <div class="row">
      <span>Invoice: <span class="bold">${escapeHtml(bill.invoice_number)}</span></span>
      <span>${escapeHtml(bill.payment_method)}</span>
    </div>
    <div class="row muted">
      <span>Date: ${formatReceiptDate(bill.created_at)}</span>
      <span>${escapeHtml(bill.cashier_name ? `Cashier: ${bill.cashier_name}` : '')}</span>
    </div>
  </div>

  ${customerBlock}

  <div class="divider"></div>

  <table class="items">
    <thead>
      <tr>
        <th style="text-align:left">Item</th>
        <th class="num">Qty</th>
        <th class="num">Rate</th>
        <th class="num">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <div class="divider"></div>

  <div class="section">
    <div class="row">
      <span>Subtotal</span>
      <span>${money(bill.subtotal)}</span>
    </div>
    ${discountRow}
    <div class="row">
      <span>Tax</span>
      <span>${money(bill.tax)}</span>
    </div>
    ${gstRows}
    <div class="double-divider"></div>
    <div class="row total">
      <span>GRAND TOTAL</span>
      <span>${money(bill.total)}</span>
    </div>
    <div class="double-divider"></div>
    ${cashDetails}
    ${creditDetails}
  </div>

  <div class="center footer">
    <div>${footer}</div>
    <div class="muted" style="font-size: 8px; margin-top: 4px;">SmartPOS • Offline-First POS</div>
  </div>
</body>
</html>`;
}
