import { prisma } from "@/lib/db";

export async function createItemFacture(data: { reference: string; libelle: string; quantity: number; unitPrice: number; remise?: number; tva?: number; total: number; factureId: string }) {
  return prisma.itemFacture.create({ data });
}

export async function getItemFactureById(id: string) {
  return prisma.itemFacture.findUnique({ where: { id } });
}

export async function getItemsByFacture(factureId: string) {
  return prisma.itemFacture.findMany({ where: { factureId } });
}

export async function updateItemFacture(id: string, data: Partial<Omit<Parameters<typeof createItemFacture>[0], "factureId">>) {
  return prisma.itemFacture.update({ where: { id }, data });
}

export async function deleteItemFacture(id: string) {
  return prisma.itemFacture.delete({ where: { id } });
}
