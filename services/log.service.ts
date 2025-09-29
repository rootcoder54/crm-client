import { prisma } from "@/lib/db";

export async function createLog(data: { action: string; details?: string; userId: string }) {
  return prisma.log.create({ data });
}

export async function getLogById(id: string) {
  return prisma.log.findUnique({ where: { id } });
}

export async function getLogsByUser(userId: string) {
  return prisma.log.findMany({ where: { userId } });
}

export async function deleteLog(id: string) {
  return prisma.log.delete({ where: { id } });
}
