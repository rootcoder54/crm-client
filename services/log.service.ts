"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { requireRoleAdmin } from "@/lib/permissions";

/**
 * Only authenticated server-side business operations write to Log.
 * Never accept a client-supplied userId to create an audit record.
 */
export async function getLogById(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non authentifié");
  const log = await prisma.log.findUnique({ where: { id } });
  if (log?.userId !== session.user.id) await requireRoleAdmin();
  return log;
}

export async function getLogsByUser(userId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non authentifié");
  if (session.user.id !== userId) await requireRoleAdmin();
  return prisma.log.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
    take: 100,
  });
}
