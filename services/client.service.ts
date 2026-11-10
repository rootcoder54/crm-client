"use server";

import { prisma } from "@/lib/db";
import { auditedMutation, auditedRead } from "@/lib/audit";

export async function createClient(data: {
  nomClient: string;
  sigle?: string;
  adresse?: string;
  telephone?: string;
  activite?: string;
  numero?: string;
  dateInscription?: string;
}) {
  return auditedMutation("CREATE", { entity: "Client", route: "/client" }, (tx) => tx.client.create({
    data: {
      nomClient: data.nomClient,
      sigle: data.sigle,
      adresse: data.adresse,
      telephone: data.telephone,
      activite: data.activite,
      numero: data.numero,
      dateInscription: data.dateInscription
        ? new Date(data.dateInscription)
        : undefined
    }
  }), (result) => result.id);
}

export async function getClientById(id: string) {
  return auditedRead({ entity: "Client", entityId: id, route: "/client" }, () => prisma.client.findUnique({
    where: { id },
    include: {
      contacts: true,
      contrats: true,
      interventions: true,
      logiciels: true,
      Facture: true,
      bases: true
    }
  }));
}

export async function getAllClients() {
  return auditedRead({ entity: "Client", route: "/client", details: "Consultation d'une liste" }, () => prisma.client.findMany({
    include: {
      Requete: true
    }
  }));
}

export async function updateClient(
  id: string,
  data: Partial<Omit<Parameters<typeof createClient>[0], "nomClient">>
) {
  return auditedMutation("UPDATE", { entity: "Client", route: "/client" }, (tx) => tx.client.update({
    where: { id },
    data: {
      sigle: data.sigle,
      adresse: data.adresse,
      telephone: data.telephone,
      activite: data.activite,
      numero: data.numero,
      dateInscription: data.dateInscription
        ? new Date(data.dateInscription)
        : undefined
    }
  }), (result) => result.id);
}

export async function lastVisite(id: string, date: Date | null) {
  return prisma.client.update({
    where: { id },
    data: {
      dateLastVisite: date
    }
  });
}

export async function deleteClient(id: string) {
  return auditedMutation("DELETE", { entity: "Client", route: "/client" }, (tx) => tx.client.delete({ where: { id } }), (result) => result.id);
}
