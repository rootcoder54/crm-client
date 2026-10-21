// Shared presentation rules. No currency conversion or inferred payment dates.
export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("fr-FR");
}

export function currencyCode(value?: string | null) {
  const code = value?.trim().toUpperCase() || "XOF";
  return ["CFA", "FCFA", "XOF"].includes(code)
    ? "XOF"
    : code === "EURO"
      ? "EUR"
      : code;
}

export function formatAmount(
  value: number | null | undefined,
  currency?: string | null,
) {
  if (value == null || !Number.isFinite(value)) return "Non renseigné";
  const code = currencyCode(currency);
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(value)} ${code === "XOF" ? "FCFA" : code}`;
}

export function totalsByCurrency(
  rows: { totalTTC?: number | null; devise?: string | null }[],
) {
  const totals = new Map<string, number>();
  for (const row of rows) {
    if (row.totalTTC == null || !Number.isFinite(row.totalTTC)) continue;
    const code = currencyCode(row.devise);
    totals.set(code, (totals.get(code) ?? 0) + row.totalTTC);
  }
  return Array.from(totals, ([currency, amount]) =>
    formatAmount(amount, currency),
  );
}

export function isUnassigned(value: string | null | undefined) {
  return !value?.trim() || value.trim() === "[]";
}
