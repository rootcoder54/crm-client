import { prisma } from "@/lib/db";

export async function createLogiciel(data: {
  nom: string;
  version: string;
  versionInterne: string;
  societe: boolean;
  poste: number;
  employe: number;
  clientServeur: boolean;
  type: string;
  dateAchat: Date;
  dossier: string;
  clientId: string;
}) {
  return prisma.logiciel.create({ data });
}

export async function getLogicielById(id: string) {
  return prisma.logiciel.findUnique({ where: { id } });
}

export async function getLogicielsByClient(clientId: string) {
  return prisma.logiciel.findMany({ where: { clientId } });
}

export async function updateLogiciel(id: string, data: Partial<Omit<Parameters<typeof createLogiciel>[0], "clientId">>) {
  return prisma.logiciel.update({ where: { id }, data });
}

export async function deleteLogiciel(id: string) {
  return prisma.logiciel.delete({ where: { id } });
}
