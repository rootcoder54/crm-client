"use client";

type PrintColumn = { key: string; label: string };

export type PrintTableConfig = {
  title: string;
  subtitle?: string;
  columns: PrintColumn[];
};

function escapeHtml(value: unknown): string {
  return String(value ?? "—")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatValue(value: unknown, key: string): string {
  if (value === null || value === undefined || value === "") return "—";
  if (key.startsWith("date")) {
    const date = value instanceof Date ? value : new Date(String(value));
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("fr-FR");
  }
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  return String(value);
}

/** Imprime les lignes transmises, indépendamment de la page de pagination affichée. */
export function printFilteredTable(
  config: PrintTableConfig,
  rows: Record<string, unknown>[],
): boolean {
  const printWindow = window.open("", "_blank", "width=1100,height=800");
  if (!printWindow) return false;
  printWindow.opener = null;

  const headers = config.columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("");
  const body = rows.map((row, index) =>
    `<tr><td class="number">${index + 1}</td>${config.columns.map((column) =>
      `<td>${escapeHtml(formatValue(row[column.key], column.key))}</td>`
    ).join("")}</tr>`
  ).join("");

  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>${escapeHtml(config.title)}</title>
<style>
  @page { size: A4 landscape; margin: 15mm; }
  * { box-sizing: border-box; }
  body { font: 12px Arial, sans-serif; color: #1b2430; margin: 0; }
  h1 { font-size: 21px; margin: 0 0 6px; }
  .subtitle { font-size: 12px; color: #475569; margin-bottom: 20px; }
  .metadata { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 14px; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  th, td { text-align: left; border: 1px solid #cbd5e1; padding: 8px; overflow-wrap: anywhere; vertical-align: top; }
  th { background: #eef2f7; font-weight: bold; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  .number { width: 40px; }
  footer { margin-top: 18px; color: #64748b; font-size: 10px; }
</style></head><body>
<h1>${escapeHtml(config.title)}</h1>
<div class="subtitle">${escapeHtml(config.subtitle ?? "")}</div>
<div class="metadata"><span>${rows.length} requête(s) dans la sélection</span><span>Imprimé le ${escapeHtml(new Date().toLocaleString("fr-FR"))}</span></div>
<table><thead><tr><th class="number">N°</th>${headers}</tr></thead><tbody>${body}</tbody></table>
<footer>CRM MaliSystem — Liste imprimée des résultats filtrés.</footer>
<script>window.addEventListener("load", function () { window.focus(); window.print(); });</script>
</body></html>`;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  return true;
}
