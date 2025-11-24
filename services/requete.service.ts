"use server";
import { prisma } from "@/lib/db";
import { Requete } from "@prisma/client";

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
  return prisma.requete.create({ data });
}

export async function getRequeteById(id: string) {
  return prisma.requete.findUnique({
    where: { id },
    include: { Intervention: true }
  });
}

export async function getRequetesByClient(clientId: string) {
  return prisma.requete.findMany({ where: { clientId } });
}

export async function getAllRequetes() {
  return prisma.requete.findMany({
    include: { client: true, Intervention: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function getDraftRequetes() {
  return prisma.requete.findMany({
    where: { status: "draft" },
    include: { client: true, Intervention: true },
    orderBy: { updatedAt: "desc" }
  });
}

export async function getSubmittedRequetes() {
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
  return prisma.requete.update({ where: { id }, data });
}

export async function autoSaveRequete(requete: Requete, status?: string) {
  const { id, ...data } = requete;
  return prisma.requete.upsert({
    where: { id },
    update: { ...data, status: status || requete.status },
    create: { ...data, status: status, id }
  });
}

export async function clotureRequete(id: string, date: Date, etat: string) {
  return prisma.requete.update({
    where: { id },
    data: {
      dateCloture: date,
      etat
    }
  });
}

export async function deleteRequete(id: string) {
  return prisma.requete.delete({ where: { id } });
}
