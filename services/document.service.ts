import { prisma } from "@/lib/db";
/*
export async function createDocument(data: { nom: string; fichier: Buffer }) {
  return prisma.document.create({ data });
}*/

export async function getDocumentById(id: string) {
  return prisma.document.findUnique({ where: { id } });
}

export async function getAllDocuments() {
  return prisma.document.findMany();
}
/*
export async function updateDocument(id: string, data: Partial<{ nom: string; fichier: Buffer }>) {
  return prisma.document.update({ where: { id }, data });
}*/

export async function deleteDocument(id: string) {
  return prisma.document.delete({ where: { id } });
}
