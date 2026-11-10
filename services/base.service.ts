"use server";
import { prisma } from "@/lib/db";

export async function createBase(data: {
  societe: string;
  chemin: string;
  convention: string;
  poste: number;
  employe: number;
  date: string;
  commentaire?: string;
  clientId: string;
}) {
  return prisma.base.create({
    data: {
      societe: data.societe,
      chemin: data.chemin,
      convention: data.convention,
      poste: data.poste,
      employe: data.employe,
      date: new Date(data.date),
      commentaire: data.commentaire,
      clientId: data.clientId
    }
  });
}

export async function getBaseById(id: string) {
  return prisma.base.findUnique({ where: { id } });
}

export async function getBasesByClient(clientId: string) {
  return prisma.base.findMany({ where: { clientId } });
}

export async function updateBase(
  id: string,
  data: Partial<Omit<Parameters<typeof createBase>[0], "clientId">>
) {
  return prisma.base.update({ where: { id }, data });
}

export async function deleteBase(id: string) {
  return prisma.base.delete({ where: { id } });
}
