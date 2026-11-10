"use server";

import { prisma } from "@/lib/db";
import { auditedMutation, auditedRead } from "@/lib/audit";
import { requirePermission } from "@/lib/permissions";

export async function createIntervention(data: {
  numero: string;
  service: string;
  intervenant: string;
  nature?: string;
  observations?: string;
  creePar?: string;
  afacturee?: boolean;
  dateCloture: Date;
  clientId?: string;
  requeteId?: string;
}) {
  await requirePermission(data.requeteId ? "/requete" : "/intervention", "create", data.requeteId ? "requete_intervention" : undefined);
  return auditedMutation("CREATE", { entity: "Intervention", route: "/intervention" }, (tx) => tx.intervention.create({ data }), (result) => result.id);
}

export async function getInterventionById(id: string) {
  return auditedRead({ entity: "Intervention", entityId: id, route: "/intervention" }, () => prisma.intervention.findUnique({
    where: { id },
    include: { items: true, document: true , client: true }
  }));
}

export async function getInterventionsByClient(clientId: string) {
  return auditedRead({ entity: "Intervention", route: "/intervention", details: "Consultation d'une liste" }, () => prisma.intervention.findMany({ where: { clientId } }));
}

export async function getInterventions() {
  return auditedRead({ entity: "Intervention", route: "/intervention", details: "Consultation d'une liste" }, () => prisma.intervention.findMany({}));
}

export async function updateIntervention(
  id: string,
  data: Partial<
    Omit<
      Parameters<typeof createIntervention>[0],
      "numero" | "service" | "intervenant" | "dateCloture" | "clientId"
    >
  >
) {
  return auditedMutation("UPDATE", { entity: "Intervention", route: "/intervention" }, (tx) => tx.intervention.update({ where: { id }, data }), (result) => result.id);
}

export async function deleteIntervention(id: string) {
  await requirePermission("/intervention", "delete");
  return auditedMutation("DELETE", { entity: "Intervention", route: "/intervention" }, (tx) => tx.intervention.delete({ where: { id } }), (result) => result.id);
}
