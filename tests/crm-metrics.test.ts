import assert from "node:assert/strict";
import test from "node:test";
import {
  currencyCode,
  formatAmount,
  formatDate,
  isUnassigned,
  totalsByCurrency,
} from "../lib/crm-metrics";

test("invoice totals keep currencies separate and omit missing amounts", () => {
  assert.deepEqual(
    totalsByCurrency([
      { totalTTC: 1000, devise: "CFA" },
      { totalTTC: 500, devise: "FCFA" },
      { totalTTC: 20, devise: "EURO" },
      { totalTTC: null, devise: "USD" },
    ]),
    [formatAmount(1500, "XOF"), formatAmount(20, "EUR")],
  );
  assert.deepEqual(totalsByCurrency([{ totalTTC: null }]), []);
  assert.equal(formatAmount(null), "Non renseigné");
  assert.equal(currencyCode(" euro "), "EUR");
});

test("missing and invalid dates are not displayed as 1970 or thrown", () => {
  assert.equal(formatDate(null), "—");
  assert.equal(formatDate("invalid"), "—");
});

test("empty serialized technician lists require assignment", () => {
  assert.equal(isUnassigned(" [] "), true);
  assert.equal(isUnassigned("  "), true);
  assert.equal(isUnassigned("Technicien A"), false);
});
