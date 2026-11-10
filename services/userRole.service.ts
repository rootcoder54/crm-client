import { prisma } from "@/lib/db";
import { requireRoleAdmin } from "@/lib/permissions";

export async function createUserRole(data: {
  name: string;
  accessLevel: number;
  userId: string;
  url?: string | null;
}) {
  await requireRoleAdmin();
  return prisma.userRole.create({ data });
}

export async function getUserRoleById(id: string) {
  await requireRoleAdmin();
  return prisma.userRole.findUnique({ where: { id } });
}

export async function getUserRolesByUserId(userId: string) {
  await requireRoleAdmin();
  return prisma.userRole.findMany({ where: { userId } });
}

export async function getUserRoleByName(userId: string, name: string) {
  await requireRoleAdmin();
  return prisma.userRole.findMany({ where: { name, userId } });
}

export async function getAllUserRoles() {
  await requireRoleAdmin();
  return prisma.userRole.findMany();
}

export async function updateUserRole(
  id: string,
  data: Partial<{ name: string; accessLevel: number; url: string | null }>
) {
  await requireRoleAdmin();
  return prisma.userRole.update({ where: { id }, data });
}

export async function deleteUserRole(id: string) {
  await requireRoleAdmin();
  return prisma.userRole.delete({ where: { id } });
}
