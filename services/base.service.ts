"use server";
import { prisma } from "@/lib/db";
import { auditedMutation } from "@/lib/audit";

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
  return auditedMutation("CREATE", { entity: "Base", route: "/client/base" }, (tx) => tx.base.create({
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
  }), (result) => result.id);
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
  return auditedMutation("UPDATE", { entity: "Base", route: "/client/base" }, (tx) => tx.base.update({ where: { id }, data }), (result) => result.id);
}

export async function deleteBase(id: string) {
  return auditedMutation("DELETE", { entity: "Base", route: "/client/base" }, (tx) => tx.base.delete({ where: { id } }), (result) => result.id);
}
