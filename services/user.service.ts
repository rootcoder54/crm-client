import { prisma } from "@/lib/db";

export async function createUser(data: { name?: string; username: string; password?: string; image?: string }) {
  return prisma.user.create({ data });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id }, include: { roles: true, logs: true } });
}

export async function getAllUsers() {
  return prisma.user.findMany({ include: { roles: true } });
}

export async function updateUser(id: string, data: Partial<{ name: string; username: string; password: string; image: string }>) {
  return prisma.user.update({ where: { id }, data });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
