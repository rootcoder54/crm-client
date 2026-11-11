"use server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { auditedMutation } from "@/lib/audit";

export async function createUser(data: {
  name?: string;
  username: string;
  password?: string;
  image?: string;
}) {
  return auditedMutation("CREATE", { entity: "User", route: "/register", details: "Création de compte" }, (tx) => tx.user.create({ data }), (result) => result.id);
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { roles: true, logs: true }
  });
}

export async function getUserByUserName(username: string) {
  return prisma.user.findUnique({
    where: { username },
    include: { roles: true, logs: true }
  });
}

export async function getAllUsers() {
  return prisma.user.findMany({ include: { roles: true } });
}

export async function updateUser(
  id: string,
  data: Partial<{
    name: string;
    username: string;
    password: string;
    image: string;
  }>
) {
  return auditedMutation("UPDATE", { entity: "User", route: "/register", details: "Modification de compte (champs non consignés)" }, (tx) => tx.user.update({ where: { id }, data }), (result) => result.id);
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (session?.user?.id === id) throw new Error("Suppression de son propre compte interdite.");
  return auditedMutation("DELETE", { entity: "User", route: "/register", details: "Suppression de compte" }, (tx) => tx.user.delete({ where: { id } }), (result) => result.id);
}
