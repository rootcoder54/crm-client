import assert from "node:assert/strict";
import test from "node:test";
import { invoiceTotals, invoiceDraftSchema } from "../lib/invoice-draft";

test("discount reduces the tax base and totals match the line totals", () => {
  const result = invoiceTotals([
    {
      reference: "",
      description: "Formation",
      quantity: 2,
      unitPrice: 10000,
      remise: 10,
      tva: 18,
    },
  ]);
  assert.equal(result.totalHT, 20000);
  assert.equal(result.remise, 2000);
  assert.equal(result.totalTVA, 3240);
  assert.equal(result.totalTTC, 21240);
});
test("invalid quantities, rates and calendar dates cannot be submitted", () => {
  const draft = {
    clientId: "client",
    date: "2026-02-28",
    type: "FACTURE",
    devise: "CFA",
    modeReglement: "Espèce",
    observation: "",
    items: [
      {
        reference: "",
        description: "Assistance",
        quantity: 1,
        unitPrice: 1.25,
        remise: 0,
        tva: 0,
      },
    ],
  };
  assert.equal(invoiceDraftSchema.safeParse(draft).success, true);
  assert.equal(
    invoiceDraftSchema.safeParse({ ...draft, date: "2026-02-31" }).success,
    false,
  );
  for (const patch of [
    { quantity: 0 },
    { quantity: 1.5 },
    { unitPrice: -1 },
    { tva: 101 },
    { remise: 101 },
    { description: "" },
  ])
    assert.equal(
      invoiceDraftSchema.safeParse({
        ...draft,
        items: [{ ...draft.items[0], ...patch }],
      }).success,
      false,
    );
});
