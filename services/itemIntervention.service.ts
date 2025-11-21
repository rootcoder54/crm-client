"use server";
import { prisma } from "@/lib/db";
import { getRequeteById } from "./requete.service";

export async function createItemIntervention(data: {
  date: Date;
  debut: string;
  fin: string;
  description?: string;
  interventionId?: string;
}) {
  return prisma.itemIntervention.create({ data });
}

export async function getItemInterventionById(id: string) {
  return prisma.itemIntervention.findUnique({ where: { id } });
}

export async function getItemsByIntervention(interventionId: string) {
  return prisma.itemIntervention.findMany({ where: { interventionId } });
}

export async function getItemsByRequete(requeteId: string) {
  const requete = await getRequeteById(requeteId);
  if (!requete || !requete.Intervention[0]) {
    return [];
  }
  return prisma.itemIntervention.findMany({
    where: { interventionId: requete?.Intervention[0].id }
  });
}

export async function updateItemIntervention(
  id: string,
  data: Partial<{ date: Date; debut: string; fin: string; description: string }>
) {
  return prisma.itemIntervention.update({ where: { id }, data });
}

export async function deleteItemIntervention(id: string) {
  return prisma.itemIntervention.delete({ where: { id } });
}
