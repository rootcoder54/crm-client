"use server";
import { prisma } from "@/lib/db";

export async function createVideo(data: {
  nom: string;
  detail?: string;
  url: string;
  description: string;
}) {
  return prisma.video.create({ data });
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
  return prisma.video.update({ where: { id }, data });
}

export async function deleteVideo(id: string) {
  return prisma.video.delete({ where: { id } });
}
