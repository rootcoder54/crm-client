"use server";
import { prisma } from "@/lib/db";
import { auditedMutation } from "@/lib/audit";

export async function createArticle(data: {
  titre: string;
  description: string;
  contenu?: string;
}) {
  return auditedMutation("CREATE", { entity: "Article", route: "/article" }, (tx) => tx.article.create({ data }), (result) => result.id);
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
  return auditedMutation("UPDATE", { entity: "Article", route: "/article" }, (tx) => tx.article.update({ where: { id }, data }), (result) => result.id);
}

export async function deleteArticle(id: string) {
  return auditedMutation("DELETE", { entity: "Article", route: "/article" }, (tx) => tx.article.delete({ where: { id } }), (result) => result.id);
}
