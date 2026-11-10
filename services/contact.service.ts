"use server";
import { prisma } from "@/lib/db";
import { auditedMutation, auditedRead } from "@/lib/audit";

export async function createContact(data: {
  nom: string;
  telephone?: string;
  email?: string;
  poste?: string;
  clientId: string;
}) {
  return auditedMutation("CREATE", { entity: "Contact", route: "/client/contact" }, (tx) => tx.contact.create({ data }), (result) => result.id);
}

export async function getContactById(id: string) {
  return auditedRead({ entity: "Contact", entityId: id, route: "/client/contact" }, () => prisma.contact.findUnique({ where: { id } }));
}

export async function getContactsByClient(clientId: string) {
  return auditedRead({ entity: "Contact", route: "/client/contact", details: "Consultation d'une liste" }, () => prisma.contact.findMany({ where: { clientId } }));
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
  return auditedMutation("UPDATE", { entity: "Contact", route: "/client/contact" }, (tx) => tx.contact.update({ where: { id }, data }), (result) => result.id);
}

export async function deleteContact(id: string) {
  return auditedMutation("DELETE", { entity: "Contact", route: "/client/contact" }, (tx) => tx.contact.delete({ where: { id } }), (result) => result.id);
}
