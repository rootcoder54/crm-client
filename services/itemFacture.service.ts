"use server";
import { prisma } from "@/lib/db";
import { auditedMutation, auditedRead } from "@/lib/audit";

export async function createItemFacture(data: {
  reference: string;
  libelle: string;
  quantity: number;
  unitPrice: number;
  remise?: number;
  tva?: number;
  total: number;
  factureId: string;
}) {
  return auditedMutation("CREATE", { entity: "ItemFacture", route: "/facture" }, (tx) => tx.itemFacture.create({
    data: {
      reference: data.reference,
      libelle: data.libelle,

      quantity:
        typeof data.quantity === "string"
          ? parseInt(data.quantity, 10)
          : data.quantity,
      unitPrice:
        typeof data.unitPrice === "string"
          ? parseInt(data.unitPrice, 10)
          : data.unitPrice,

      remise:
        typeof data.remise === "string" ? parseFloat(data.remise) : data.remise,

      tva: typeof data.tva === "string" ? parseFloat(data.tva) : data.tva,
      total:
        typeof data.total === "string" ? parseFloat(data.total) : data.total,

      factureId: data.factureId
    }
  }), (result) => result.id);
}

export async function getItemFactureById(id: string) {
  return auditedRead({ entity: "ItemFacture", entityId: id, route: "/facture" }, () => prisma.itemFacture.findUnique({ where: { id } }));
}

export async function getItemsByFacture(factureId: string) {
  return auditedRead({ entity: "ItemFacture", route: "/facture", details: "Consultation d'une liste" }, () => prisma.itemFacture.findMany({ where: { factureId } }));
}

export async function updateItemFacture(
  id: string,
  data: Partial<Omit<Parameters<typeof createItemFacture>[0], "factureId">>
) {
  return auditedMutation("UPDATE", { entity: "ItemFacture", route: "/facture" }, (tx) => tx.itemFacture.update({ where: { id }, data }), (result) => result.id);
}

export async function deleteItemFacture(id: string) {
  return auditedMutation("DELETE", { entity: "ItemFacture", route: "/facture" }, (tx) => tx.itemFacture.delete({ where: { id } }), (result) => result.id);
}
