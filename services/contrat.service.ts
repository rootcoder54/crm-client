import { prisma } from "@/lib/db";

export async function createContrat(data: { dateDebut: Date; dateFin: Date; type?: string; reconduction?: string; clientId: string }) {
  return prisma.contrat.create({ data });
}

export async function getContratById(id: string) {
  return prisma.contrat.findUnique({ where: { id } });
}

export async function getContratsByClient(clientId: string) {
  return prisma.contrat.findMany({ where: { clientId } });
}

export async function updateContrat(id: string, data: Partial<{ dateDebut: Date; dateFin: Date; type: string; reconduction: string }>) {
  return prisma.contrat.update({ where: { id }, data });
}

export async function deleteContrat(id: string) {
  return prisma.contrat.delete({ where: { id } });
}
