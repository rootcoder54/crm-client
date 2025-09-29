import { prisma } from "@/lib/db";

export async function createClient(data: {
  nomClient: string;
  sigle?: string;
  adresse?: string;
  telephone?: string;
  activite?: string;
  numero?: string;
  dateInscription?: Date;
}) {
  return prisma.client.create({ data });
}

export async function getClientById(id: string) {
  return prisma.client.findUnique({
    where: { id },
    include: { contacts: true, contrats: true, interventions: true, logiciels: true, Facture: true }
  });
}

export async function getAllClients() {
  return prisma.client.findMany();
}

export async function updateClient(id: string, data: Partial<Omit<Parameters<typeof createClient>[0], "nomClient">>) {
  return prisma.client.update({ where: { id }, data });
}

export async function deleteClient(id: string) {
  return prisma.client.delete({ where: { id } });
}
