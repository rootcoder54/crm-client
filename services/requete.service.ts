"use server";
import { prisma } from "@/lib/db";
import { auditedMutation } from "@/lib/audit";
import { Requete } from "@prisma/client";
import { requirePermission } from "@/lib/permissions";

export async function createRequete(data: {
  sujet: string;
  description?: string;
  type?: string;
  observation?: string;
  logiciel?: string;
  demandeur?: string;
  technicien?: string;
  dateDebut: Date;
  dateCloture?: Date;
  etat?: string;
  isTacheClient?: boolean;
  clientId?: string;
}) {
  await requirePermission("/requete", "create");
  return auditedMutation("CREATE", { entity: "Requete", route: "/requete" }, (tx) => tx.requete.create({ data }), (result) => result.id);
}

export async function getRequeteById(id: string) {
  await requirePermission("/requete", "read");
  return prisma.requete.findUnique({
    where: { id },
    include: { Intervention: true }
  });
}

export async function getRequeteByIdWithOutIntervention(id: string) {
  await requirePermission("/requete", "read");
  return prisma.requete.findUnique({
    where: { id }
  });
}

export async function getRequetesByClient(clientId: string) {
  await requirePermission("/requete", "read");
  return prisma.requete.findMany({ where: { clientId } });
}

export async function getAllRequetes() {
  await requirePermission("/requete", "read");
  return prisma.requete.findMany({
    include: { client: true, Intervention: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function getRequetesTech() {
  await requirePermission("/requete", "read");
  return prisma.requete.findMany({
    where: { technicien: { not: null } },
    orderBy: { createdAt: "desc" },
    distinct: ["technicien"]
  });
}

export async function getDraftRequetes() {
  await requirePermission("/requete", "read");
  return prisma.requete.findMany({
    where: { status: "draft" },
    include: { client: true, Intervention: true },
    orderBy: { updatedAt: "desc" }
  });
}

export async function getNumberOfDraftRequetes() {
  await requirePermission("/requete", "read");
  return prisma.requete.count({
    where: { status: "draft" }
  });
}

export async function getSubmittedRequetes() {
  await requirePermission("/requete", "read");
  return prisma.requete.findMany({
    where: { status: "submitted" },
    include: { client: true, Intervention: true },
    orderBy: { createdAt: "desc" }
  });
}
export async function updateRequete(
  id: string,
  data: Partial<
    Omit<
      Parameters<typeof createRequete>[0],
      "clientId" | "sujet" | "dateDebut"
    >
  >
) {
  await requirePermission("/requete", "update", "requete_edite");
  return auditedMutation("UPDATE", { entity: "Requete", route: "/requete" }, (tx) => tx.requete.update({ where: { id }, data }), (result) => result.id);
}

export async function autoSaveRequete(requete: Requete, status?: string) {
  await requirePermission("/requete", "create");
  const { id, ...data } = requete;
  // Draft autosaves are not user validations and should not flood the audit log.
  if (status === "submitted") {
    return auditedMutation(
      "CREATE",
      { entity: "Requete", route: "/requete" },
      (tx) => tx.requete.upsert({
        where: { id },
        update: { ...data, status: "submitted" },
        create: { ...data, status: "submitted", id },
      }),
      (result) => result.id,
    );
  }
  return prisma.requete.upsert({
    where: { id },
    update: { ...data, status: status || requete.status },
    create: { ...data, status: status, id }
  });
}

export async function clotureRequete(id: string, date: Date, etat: string) {
  await requirePermission("/requete", "update", "requete_cloture");
  return auditedMutation("CLOSE", { entity: "Requete", route: "/requete" }, (tx) => tx.requete.update({
    where: { id },
    data: {
      dateCloture: date,
      etat
    }
  }), (result) => result.id);
}

export async function deleteRequete(id: string) {
  await requirePermission("/requete", "delete", "requete_delete");
  return auditedMutation("DELETE", { entity: "Requete", route: "/requete" }, (tx) => tx.requete.delete({ where: { id } }), (result) => result.id);
}
