"use server";

import { prisma } from "@/lib/db";
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
  return prisma.intervention.create({ data });
}

export async function getInterventionById(id: string) {
  return prisma.intervention.findUnique({
    where: { id },
    include: { items: true, document: true , client: true }
  });
}

export async function getInterventionsByClient(clientId: string) {
  return prisma.intervention.findMany({ where: { clientId } });
}

export async function getInterventions() {
  return prisma.intervention.findMany({});
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
  return prisma.intervention.update({ where: { id }, data });
}

export async function deleteIntervention(id: string) {
  await requirePermission("/intervention", "delete");
  return prisma.intervention.delete({ where: { id } });
}
