"use server";
import { prisma } from "@/lib/db";

export async function createFacture(data: {
  numero: string;
  date: Date;
  type?: string;
  acquittee?: boolean;
  numeroOrdre?: number;
  modeReglement?: string;
  devise?: string;
  observation?: string;
  totalHT?: number;
  remise?: number;
  totalTTC?: number;
  totalTVA?: number;
  clientId: string;
}) {
  return prisma.facture.create({ data });
}

export async function getFactureById(id: string) {
  return prisma.facture.findUnique({
    where: { id },
    include: { itemFactures: true }
  });
}

export async function getFacturesByClient(clientId: string) {
  return prisma.facture.findMany({
    where: { clientId },
    include: { itemFactures: true }
  });
}

export async function getAllFactures() {
  return prisma.facture.findMany({
    include: { itemFactures: true, client: true }
  });
}

export const maxorder = async () => {
  const dernier = await prisma.facture.findFirst({
    orderBy: {
      numeroOrdre: "desc"
    },
    select: {
      numeroOrdre: true
    }
  });

  return dernier?.numeroOrdre ?? 0;
};

export async function updateFacture(
  id: string,
  data: Partial<
    Omit<Parameters<typeof createFacture>[0], "numero" | "date" | "clientId">
  >
) {
  return prisma.facture.update({ where: { id }, data });
}

export async function deleteFacture(id: string) {
  return prisma.facture.delete({ where: { id } });
}
