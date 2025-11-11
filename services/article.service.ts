"use server";
import { prisma } from "@/lib/db";

export async function createArticle(data: {
  titre: string;
  description: string;
  contenu?: string;
}) {
  return prisma.article.create({ data });
}

export async function getArticleById(id: string) {
  return prisma.article.findUnique({ where: { id } });
}

export async function getAllArticles() {
  return prisma.article.findMany();
}

export async function updateArticle(
  id: string,
  data: Partial<Omit<Parameters<typeof createArticle>[0], "titre">>
) {
  return prisma.article.update({ where: { id }, data });
}

export async function deleteArticle(id: string) {
  return prisma.article.delete({ where: { id } });
}
