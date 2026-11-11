import assert from "node:assert/strict";
import test from "node:test";
import { storeUpdateSchema } from "../src/schemas.js";

test("store update accepts a valid currency and normalizes the code", () => {
  const result = storeUpdateSchema.safeParse({ currency_code: "eur", currency_symbol: "€" });
  assert.equal(result.success, true);
  if (!result.success) return;
  assert.equal(result.data.currency_code, "EUR");
  assert.equal(result.data.currency_symbol, "€");
});

test("store update rejects malformed currency values", () => {
  assert.equal(storeUpdateSchema.safeParse({ currency_code: "EURO" }).success, false);
  assert.equal(storeUpdateSchema.safeParse({ currency_symbol: "" }).success, false);
  assert.equal(storeUpdateSchema.safeParse({ currency_symbol: "123456789" }).success, false);
});
