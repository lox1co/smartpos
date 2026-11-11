import { formatCents } from './money';

export interface ReceiptItem {
  name: string;
  quantity: number;
  priceCents: number;
  totalCents: number;
}

export interface ReceiptData {
  shopName: string;
  storeAddress?: string;
  storePhone?: string;
  gstNumber?: string;
  currencySymbol: string;
  invoiceNumber: string;
  createdAt: number;
  paymentMethod: string;
  paymentStatus: string;
  customerName?: string;
  customerPhone?: string;
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  amountPaidCents?: number;
  changeDueCents?: number;
  items: ReceiptItem[];
}

export function generateReceiptHtml(data: ReceiptData): string {
  const dateStr = new Date(data.createdAt).toLocaleString();
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 4px 0;">${item.name} x ${item.quantity}</td>
        <td style="text-align: right; padding: 4px 0;">${formatCents(item.totalCents, data.currencySymbol)}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @page { size: 80mm auto; margin: 0; }
      body {
        font-family: monospace, sans-serif;
        font-size: 12px;
        color: #000;
        width: 72mm;
        margin: 0 auto;
        padding: 10px 4px;
      }
      .center { text-align: center; }
      .bold { font-weight: bold; }
      .divider { border-top: 1px dashed #000; margin: 8px 0; }
      table { width: 100%; border-collapse: collapse; font-size: 11px; }
      .row { display: flex; justify-content: space-between; margin: 3px 0; }
    </style>
  </head>
  <body>
    <div class="center bold" style="font-size: 16px;">${data.shopName}</div>
    ${data.storeAddress ? `<div class="center">${data.storeAddress}</div>` : ''}
    ${data.storePhone ? `<div class="center">Tel: ${data.storePhone}</div>` : ''}
    ${data.gstNumber ? `<div class="center">GSTIN: ${data.gstNumber}</div>` : ''}
    <div class="divider"></div>

    <div class="row"><span>Invoice:</span><span class="bold">${data.invoiceNumber}</span></div>
    <div class="row"><span>Date:</span><span>${dateStr}</span></div>
    <div class="row"><span>Method:</span><span>${data.paymentMethod}</span></div>
    ${data.customerName ? `<div class="row"><span>Customer:</span><span>${data.customerName}</span></div>` : ''}

    <div class="divider"></div>
    <table>
      <thead>
        <tr style="border-bottom: 1px solid #000;">
          <th style="text-align: left; padding-bottom: 4px;">Item</th>
          <th style="text-align: right; padding-bottom: 4px;">Total</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <div class="divider"></div>
    <div class="row"><span>Subtotal:</span><span>${formatCents(data.subtotalCents, data.currencySymbol)}</span></div>
    ${data.discountCents > 0 ? `<div class="row"><span>Discount:</span><span>-${formatCents(data.discountCents, data.currencySymbol)}</span></div>` : ''}
    ${data.taxCents > 0 ? `<div class="row"><span>Tax:</span><span>${formatCents(data.taxCents, data.currencySymbol)}</span></div>` : ''}
    <div class="row bold" style="font-size: 14px; margin-top: 4px;"><span>TOTAL:</span><span>${formatCents(data.totalCents, data.currencySymbol)}</span></div>

    ${data.amountPaidCents !== undefined ? `<div class="row" style="margin-top: 6px;"><span>Tendered:</span><span>${formatCents(data.amountPaidCents, data.currencySymbol)}</span></div>` : ''}
    ${data.changeDueCents !== undefined && data.changeDueCents > 0 ? `<div class="row bold" style="font-size: 13px;"><span>CHANGE DUE:</span><span>${formatCents(data.changeDueCents, data.currencySymbol)}</span></div>` : ''}

    <div class="divider"></div>
    <div class="center" style="margin-top: 10px;">Thank you for your business!</div>
  </body>
</html>`;
}
