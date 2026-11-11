export const toCents = (amount: number): number => {
  return Math.round(amount * 100);
};

export const fromCents = (cents: number): number => {
  return cents / 100;
};

export const formatCents = (cents: number, symbol: string = '$'): string => {
  const absoluteCents = Math.abs(cents);
  const formatted = (absoluteCents / 100).toFixed(2);
  const sign = cents < 0 ? '-' : '';
  return `${sign}${symbol}${formatted}`;
};

export const calculateTaxCents = (taxableCents: number, taxRatePercent: number): number => {
  return Math.round((taxableCents * taxRatePercent) / 100);
};

export const calculateDiscountCents = (subtotalCents: number, discountPercent: number): number => {
  return Math.round((subtotalCents * discountPercent) / 100);
};
