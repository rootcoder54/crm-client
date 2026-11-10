"use server";
import { prisma } from "@/lib/db";
import { auditedMutation, auditedRead } from "@/lib/audit";
import { requirePermission } from "@/lib/permissions";
import { getRequeteById } from "./requete.service";

export async function createItemIntervention(data: {
  date: Date;
  debut: string;
  fin: string;
  description?: string;
  interventionId?: string;
}) {
  await requirePermission("/requete", "update", "requete_intervention");
  return auditedMutation("CREATE", { entity: "ItemIntervention", route: "/requete/intervention" }, (tx) => tx.itemIntervention.create({ data }), (result) => result.id);
}

export async function getItemInterventionById(id: string) {
  return auditedRead({ entity: "ItemIntervention", entityId: id, route: "/requete/intervention" }, () => prisma.itemIntervention.findUnique({ where: { id } }));
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
  return auditedMutation("UPDATE", { entity: "ItemIntervention", route: "/requete/intervention" }, (tx) => tx.itemIntervention.update({ where: { id }, data }), (result) => result.id);
}

export async function deleteItemIntervention(id: string) {
  await requirePermission("/requete", "delete", "requete_intervention");
  return auditedMutation("DELETE", { entity: "ItemIntervention", route: "/requete/intervention" }, (tx) => tx.itemIntervention.delete({ where: { id } }), (result) => result.id);
}
