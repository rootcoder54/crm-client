import { prisma } from "@/lib/db";

export async function createUserRole(data: { name: string; accessLevel: number; userId: string }) {
  return prisma.userRole.create({ data });
}

export async function getUserRoleById(id: string) {
  return prisma.userRole.findUnique({ where: { id } });
}

export async function getAllUserRoles() {
  return prisma.userRole.findMany();
}

export async function updateUserRole(id: string, data: Partial<{ name: string; accessLevel: number }>) {
  return prisma.userRole.update({ where: { id }, data });
}

export async function deleteUserRole(id: string) {
  return prisma.userRole.delete({ where: { id } });
}
