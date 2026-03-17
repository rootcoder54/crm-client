"use server";

import { prisma } from "@/lib/db";

export async function createClient(data: {
  nomClient: string;
  sigle?: string;
  adresse?: string;
  telephone?: string;
  activite?: string;
  numero?: string;
  dateInscription?: string;
}) {
  return prisma.client.create({
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
  });
}

export async function getClientById(id: string) {
  return prisma.client.findUnique({
    where: { id },
    include: {
      contacts: true,
      contrats: true,
      interventions: true,
      logiciels: true,
      Facture: true,
      bases: true
    }
  });
}

export async function getAllClients() {
  return prisma.client.findMany();
}

export async function updateClient(
  id: string,
  data: Partial<Omit<Parameters<typeof createClient>[0], "nomClient">>
) {
  return prisma.client.update({
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
  });
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
  return prisma.client.delete({ where: { id } });
}
