import { z } from "zod";

export const invoiceLineSchema = z.object({
  reference: z.string(),
  description: z
    .string()
    .trim()
    .min(1, "Renseignez la description de chaque ligne."),
  quantity: z.number().int().min(1).max(1000000),
  unitPrice: z.number().min(0).max(1000000000000),
  remise: z.number().min(0).max(100),
  tva: z.number().min(0).max(100),
});
export const invoiceDraftSchema = z.object({
  clientId: z.string().min(1, "Sélectionnez un client."),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((value) => {
      const date = new Date(value + "T12:00:00Z");
      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      );
    }, "La date est invalide."),
  type: z.enum(["FACTURE", "PROFORMA"]),
  devise: z.enum(["CFA", "EURO", "USD"]),
  modeReglement: z.string().min(1),
  observation: z.string(),
  items: z.array(invoiceLineSchema).min(1, "Ajoutez au moins une ligne."),
});
export type InvoiceLine = z.infer<typeof invoiceLineSchema>;
export type InvoiceDraft = z.infer<typeof invoiceDraftSchema>;
const round = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;
export function invoiceTotals(items: InvoiceLine[]) {
  const lines = items.map((item) => {
    const gross = round(item.quantity * item.unitPrice);
    const discount = round((gross * item.remise) / 100);
    const net = round(gross - discount);
    const tax = round((net * item.tva) / 100);
    return { gross, discount, net, tax, total: round(net + tax) };
  });
  return {
    lines,
    totalHT: round(lines.reduce((s, l) => s + l.gross, 0)),
    remise: round(lines.reduce((s, l) => s + l.discount, 0)),
    totalTVA: round(lines.reduce((s, l) => s + l.tax, 0)),
    totalTTC: round(lines.reduce((s, l) => s + l.total, 0)),
  };
}

export const invoiceEditingSchema = invoiceDraftSchema.extend({
  clientId: z.string(),
  items: z.array(
    invoiceLineSchema.extend({
      description: z.string(),
      quantity: z.number().int().min(0).max(1000000),
    }),
  ),
});
