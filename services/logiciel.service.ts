import { prisma } from "@/lib/db";
import { auditedMutation, auditedRead } from "@/lib/audit";

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
  return auditedMutation("CREATE", { entity: "Logiciel", route: "/client/logiciel" }, (tx) => tx.logiciel.create({ data }), (result) => result.id);
}

export async function getLogicielById(id: string) {
  return auditedRead({ entity: "Logiciel", entityId: id, route: "/client/logiciel" }, () => prisma.logiciel.findUnique({ where: { id } }));
}

export async function getLogicielsByClient(clientId: string) {
  return auditedRead({ entity: "Logiciel", route: "/client/logiciel", details: "Consultation d'une liste" }, () => prisma.logiciel.findMany({ where: { clientId } }));
}

export async function updateLogiciel(id: string, data: Partial<Omit<Parameters<typeof createLogiciel>[0], "clientId">>) {
  return auditedMutation("UPDATE", { entity: "Logiciel", route: "/client/logiciel" }, (tx) => tx.logiciel.update({ where: { id }, data }), (result) => result.id);
}

export async function deleteLogiciel(id: string) {
  return auditedMutation("DELETE", { entity: "Logiciel", route: "/client/logiciel" }, (tx) => tx.logiciel.delete({ where: { id } }), (result) => result.id);
}
