"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import {
  invoiceDraftSchema,
  invoiceTotals,
  type InvoiceDraft,
} from "@/lib/invoice-draft";

export async function saveInvoiceDraft(input: InvoiceDraft) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error("Votre session a expiré. Reconnectez-vous.");
  const data = invoiceDraftSchema.parse(input);
  const totals = invoiceTotals(data.items);
  return prisma.$transaction(async (tx) => {
    const client = await tx.client.findUnique({ where: { id: data.clientId } });
    if (!client?.numero)
      throw new Error(
        "Renseignez le numéro du client avant de créer sa facture.",
      );
    const latest = await tx.facture.aggregate({ _max: { numeroOrdre: true } });
    let numeroOrdre = (latest._max.numeroOrdre ?? 0) + 1;
    const makeNumber = () =>
      `${data.date.slice(0, 4)}/${String(numeroOrdre).padStart(4, "0")}/${client.numero}`;
    while (
      await tx.facture.findFirst({
        where: { numero: makeNumber() },
        select: { id: true },
      })
    )
      numeroOrdre++;
    return tx.facture.create({
      data: {
        clientId: data.clientId,
        numero: makeNumber(),
        numeroOrdre,
        date: new Date(data.date + "T12:00:00"),
        type: data.type,
        devise: data.devise,
        modeReglement: data.modeReglement,
        observation: data.observation,
        acquittee: false,
        totalHT: totals.totalHT,
        remise: totals.remise,
        totalTVA: totals.totalTVA,
        totalTTC: totals.totalTTC,
        itemFactures: {
          create: data.items.map((item, index) => ({
            reference: item.reference || `${client.numero}-${index + 1}`,
            libelle: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            remise: item.remise,
            tva: item.tva,
            total: totals.lines[index].total,
          })),
        },
      },
      select: { id: true, numero: true },
    });
  });
}
