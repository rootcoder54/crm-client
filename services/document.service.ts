import { prisma } from "@/lib/db";
import { auditedMutation } from "@/lib/audit";
/*
export async function createDocument(data: { nom: string; fichier: Buffer }) {
  return auditedMutation("CREATE", { entity: "Document", route: "/document" }, (tx) => tx.document.create({ data }), (result) => result.id);
}*/

export async function getDocumentById(id: string) {
  return prisma.document.findUnique({ where: { id } });
}

export async function getAllDocuments() {
  return prisma.document.findMany();
}
/*
export async function updateDocument(id: string, data: Partial<{ nom: string; fichier: Buffer }>) {
  return auditedMutation("UPDATE", { entity: "Document", route: "/document" }, (tx) => tx.document.update({ where: { id }, data }), (result) => result.id);
}*/

export async function deleteDocument(id: string) {
  return auditedMutation("DELETE", { entity: "Document", route: "/document" }, (tx) => tx.document.delete({ where: { id } }), (result) => result.id);
}
