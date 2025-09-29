import { prisma } from "@/lib/db";

export async function createBase(data: { societe: string; chemin: string; convention: string; poste: number; employe: number; date: Date; commentaire?: string; clientId: string }) {
  return prisma.base.create({ data });
}

export async function getBaseById(id: string) {
  return prisma.base.findUnique({ where: { id } });
}

export async function getBasesByClient(clientId: string) {
  return prisma.base.findMany({ where: { clientId } });
}

export async function updateBase(id: string, data: Partial<Omit<Parameters<typeof createBase>[0], "clientId">>) {
  return prisma.base.update({ where: { id }, data });
}

export async function deleteBase(id: string) {
  return prisma.base.delete({ where: { id } });
}
