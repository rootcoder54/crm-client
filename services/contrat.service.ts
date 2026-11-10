"use server";

import { prisma } from "@/lib/db";
import { auditedMutation, auditedRead } from "@/lib/audit";

export async function createContrat(data: {
  dateDebut: Date;
  dateFin: Date;
  type?: string;
  reconduction?: string;
  clientId: string;
}) {
  return auditedMutation("CREATE", { entity: "Contrat", route: "/client/contrat" }, (tx) => tx.contrat.create({ data }), (result) => result.id);
}

export async function getContratById(id: string) {
  return auditedRead({ entity: "Contrat", entityId: id, route: "/client/contrat" }, () => prisma.contrat.findUnique({ where: { id } }));
}

export async function getContratsByClient(clientId: string) {
  return auditedRead({ entity: "Contrat", route: "/client/contrat", details: "Consultation d'une liste" }, () => prisma.contrat.findMany({ where: { clientId } }));
}

export async function updateContrat(
  id: string,
  data: Partial<{
    dateDebut: Date;
    dateFin: Date;
    type: string;
    reconduction: string;
  }>
) {
  return auditedMutation("UPDATE", { entity: "Contrat", route: "/client/contrat" }, (tx) => tx.contrat.update({ where: { id }, data }), (result) => result.id);
}

export async function deleteContrat(id: string) {
  return auditedMutation("DELETE", { entity: "Contrat", route: "/client/contrat" }, (tx) => tx.contrat.delete({ where: { id } }), (result) => result.id);
}
