"use server";
import { prisma } from "@/lib/db";

export async function createContact(data: {
  nom: string;
  telephone?: string;
  email?: string;
  poste?: string;
  clientId: string;
}) {
  return prisma.contact.create({ data });
}

export async function getContactById(id: string) {
  return prisma.contact.findUnique({ where: { id } });
}

export async function getContactsByClient(clientId: string) {
  return prisma.contact.findMany({ where: { clientId } });
}

export async function updateContact(
  id: string,
  data: Partial<{
    nom: string;
    telephone: string;
    email: string;
    poste: string;
  }>
) {
  return prisma.contact.update({ where: { id }, data });
}

export async function deleteContact(id: string) {
  return prisma.contact.delete({ where: { id } });
}
