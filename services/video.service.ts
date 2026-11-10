"use server";
import { prisma } from "@/lib/db";
import { auditedMutation, auditedRead } from "@/lib/audit";

export async function createVideo(data: {
  nom: string;
  detail?: string;
  url: string;
  description: string;
}) {
  return auditedMutation("CREATE", { entity: "Video", route: "/video" }, (tx) => tx.video.create({ data }), (result) => result.id);
}

export async function getVideoById(id: string) {
  return prisma.video.findUnique({ where: { id } });
}

export async function getAllVideos() {
  return prisma.video.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateVideo(
  id: string,
  data: Partial<Omit<Parameters<typeof createVideo>[0], "nom">>
) {
  return auditedMutation("UPDATE", { entity: "Video", route: "/video" }, (tx) => tx.video.update({ where: { id }, data }), (result) => result.id);
}

export async function deleteVideo(id: string) {
  return auditedMutation("DELETE", { entity: "Video", route: "/video" }, (tx) => tx.video.delete({ where: { id } }), (result) => result.id);
}
