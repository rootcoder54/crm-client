import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { canAccess } from "@/lib/permissions";
import {
  booleanCell, cellText, dateCell, importResponse, ImportFileError,
  lookupClient, numberCell, readExcelImport, requiredText,
  type ImportIssue,
} from "@/lib/import-excel";
import { NextRequest, NextResponse } from "next/server";

type Item = { reference: string; libelle: string; quantity: number; unitPrice: number; remise: number; tva: number; total: number };
type InvoiceBatch = {
  numero: string; date: Date; clientId: string;
  type: string; devise: string; modeReglement: string | null;
  observation: string | null; acquittee: boolean;
  items: Item[]; lines: number[];
};
const round = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    if (!(await canAccess(session.user.id, "/facture", "create")) ||
        !(await canAccess(session.user.id, "/importation", "create")))
      return NextResponse.json({ message: "Accès refusé : création de factures non autorisée" }, { status: 403 });
    const form = await request.formData();
    const { lines } = await readExcelImport(
      form.get("file"),
      ["numero", "date", "libelle", "quantity", "unitPrice"],
      [["clientId", "clientNumero", "numeroClient", "nomClient"]],
    );
    const clients = await prisma.client.findMany({
      select: { id: true, numero: true, nomClient: true },
    });
    const batches = new Map<string, InvoiceBatch>();
    const invalid = new Map<string, string>();
    const issues: ImportIssue[] = [];
    for (const { ligne, row } of lines) {
      const numero = cellText(row.numero);
      try {
        const client = lookupClient(row, clients);
        requiredText(row, "numero");
        const date = dateCell(row.date, "date");
        if (!date) throw new Error("Date de facturation obligatoire");
        const type = cellText(row.type).toUpperCase() || "FACTURE";
        if (!["FACTURE", "PROFORMA"].includes(type))
          throw new Error("Type invalide : FACTURE ou PROFORMA attendu");
        const deviseInput = cellText(row.devise).toUpperCase() || "CFA";
        const devise = deviseInput === "FCFA" || deviseInput === "XOF" ? "CFA" : deviseInput === "EUR" ? "EURO" : deviseInput;
        if (!["CFA", "EURO", "USD"].includes(devise))
          throw new Error("Devise invalide : CFA, EURO ou USD attendu");
        const acquittee = booleanCell(row.acquittee, "acquittee") ?? false;
        const quantity = numberCell(row.quantity, "quantity", { integer: true, min: 1, max: 1000000 });
        const unitPrice = numberCell(row.unitPrice, "unitPrice", { min: 0, max: 1000000000000 });
        if (quantity === null || unitPrice === null) throw new Error("Quantité et prix unitaire obligatoires");
        const remise = numberCell(row.remise, "remise", { min: 0, max: 100 }) ?? 0;
        const tva = numberCell(row.tva, "tva", { min: 0, max: 100 }) ?? 0;
        const gross = round(quantity * unitPrice);
        const net = round(gross - round(gross * remise / 100));
        const total = round(net + round(net * tva / 100));
        const item: Item = {
          reference: cellText(row.reference) || "IMPORT-" + ligne,
          libelle: requiredText(row, "libelle"),
          quantity, unitPrice, remise, tva, total,
        };
        const meta = {
          numero, date, clientId: client.id, type, devise,
          modeReglement: cellText(row.modeReglement) || null,
          observation: cellText(row.observation) || null, acquittee,
        };
        const batch = batches.get(numero);
        if (batch) {
          if (batch.clientId !== meta.clientId ||
              batch.date.getTime() !== meta.date.getTime() ||
              batch.type !== meta.type || batch.devise !== meta.devise ||
              batch.modeReglement !== meta.modeReglement ||
              batch.acquittee !== meta.acquittee ||
              batch.observation !== meta.observation)
            throw new Error("Incohérence entre les lignes d'une même facture");
          batch.items.push(item);
          batch.lines.push(ligne);
        } else {
          batches.set(numero, { ...meta, items: [item], lines: [ligne] });
        }
      } catch (error) {
        issues.push({ ligne, raison: error instanceof Error ? error.message : "Donnée invalide" });
        if (numero) invalid.set(numero, "Facture ignorée : au moins une ligne invalide");
      }
    }
    let imported = 0;
    for (const [numero, batch] of batches) {
      if (invalid.has(numero)) {
        for (const ligne of batch.lines) issues.push({ ligne, raison: invalid.get(numero)! });
        continue;
      }
      try {
        // A number identifies one invoice; never silently append to an existing invoice.
        if (await prisma.facture.findFirst({ where: { numero }, select: { id: true } }))
          throw new Error("Une facture avec ce numéro existe déjà");
        await prisma.$transaction(async (tx) => {
          // Recheck inside the transaction to limit concurrent duplicate imports.
          if (await tx.facture.findFirst({ where: { numero }, select: { id: true } }))
            throw new Error("Une facture avec ce numéro existe déjà");
          const totalHT = round(batch.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0));
          const discount = round(batch.items.reduce((sum, item) => sum + round(item.quantity * item.unitPrice * item.remise / 100), 0));
          const totalTTC = round(batch.items.reduce((sum, item) => sum + item.total, 0));
          const totalTVA = round(totalTTC - (totalHT - discount));
          const facture = await tx.facture.create({
            data: {
              numero, date: batch.date, clientId: batch.clientId,
              type: batch.type, devise: batch.devise,
              modeReglement: batch.modeReglement, observation: batch.observation,
              acquittee: batch.acquittee,
              totalHT, remise: discount, totalTVA, totalTTC,
              itemFactures: { create: batch.items },
            },
          });
          await tx.log.create({
            data: {
              userId: session.user.id,
              actorUsername: session.user.username || session.user.name || null,
              action: "CREATE", entity: "Facture", entityId: facture.id,
              route: "/facture",
              details: "Création de la facture " + numero.slice(0, 160) + " par importation Excel",
            },
          });
        });
        imported++;
      } catch (error) {
        const reason = error instanceof Error ? error.message : "Erreur d'enregistrement";
        for (const ligne of batch.lines) issues.push({ ligne, raison: reason });
      }
    }
    return NextResponse.json(importResponse(imported, issues.length, issues, {
      facturesImportees: imported,
      lignesTraitees: lines.length,
    }));
  } catch (error) {
    if (error instanceof ImportFileError)
      return NextResponse.json({ message: error.message, colonnesManquantes: error.colonnesManquantes }, { status: error.status });
    console.error("Importation de factures :", error);
    return NextResponse.json({ message: "Erreur lors de l'importation des factures" }, { status: 500 });
  }
}
