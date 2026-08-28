"use server";
import { prisma } from "@/lib/db";

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
  return prisma.itemFacture.create({
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
  });
}

export async function getItemFactureById(id: string) {
  return prisma.itemFacture.findUnique({ where: { id } });
}

export async function getItemsByFacture(factureId: string) {
  return prisma.itemFacture.findMany({ where: { factureId } });
}

export async function updateItemFacture(
  id: string,
  data: Partial<Omit<Parameters<typeof createItemFacture>[0], "factureId">>
) {
  return prisma.itemFacture.update({ where: { id }, data });
}

export async function deleteItemFacture(id: string) {
  return prisma.itemFacture.delete({ where: { id } });
}
