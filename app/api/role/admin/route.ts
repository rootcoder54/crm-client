import { auth } from "@/auth";
import { requireRoleAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const roleSchema = z.object({
  userId: z.string().min(1),
  name: z.string().trim().min(1).max(100),
  url: z.string().trim().startsWith("/").max(250).nullable().optional(),
  accessLevel: z.number().int().min(0).max(3),
});

async function verify() {
  const session = await auth();
  if (!session?.user?.id) return 401;
  try { await requireRoleAdmin(); return 200; } catch { return 403; }
}

export async function GET() {
  const status = await verify();
  if (status !== 200) return NextResponse.json({ error: "Accès refusé" }, { status });
  const [users, roles] = await Promise.all([
    prisma.user.findMany({ select: { id: true, name: true, username: true }, orderBy: { username: "asc" } }),
    prisma.userRole.findMany({ orderBy: [{ userId: "asc" }, { name: "asc" }] }),
  ]);
  return NextResponse.json({ users, roles });
}

export async function POST(req: Request) {
  const status = await verify();
  if (status !== 200) return NextResponse.json({ error: "Accès refusé" }, { status });
  const parsed = roleSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  const { userId, name, url, accessLevel } = parsed.data;
  try {
    const admin = await auth();
    if (!admin?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const role = await prisma.$transaction(async (tx) => {
      const existing = await tx.userRole.findUnique({ where: { userId_name: { userId, name } } });
      const result = await tx.userRole.upsert({
        where: { userId_name: { userId, name } },
        create: { userId, name, url: url || null, accessLevel },
        update: { url: url || null, accessLevel },
      });
      await tx.log.create({ data: {
        userId: admin.user.id,
        actorUsername: admin.user.username || admin.user.name || null,
        action: existing ? "UPDATE" : "CREATE",
        entity: "UserRole",
        entityId: result.id,
        route: "/roles",
        details: `Permission ${name} (niveau ${accessLevel}) pour l'utilisateur ${userId}`,
      } });
      return result;
    });
    return NextResponse.json(role);
  } catch {
    return NextResponse.json({ error: "Impossible d'enregistrer la permission" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const status = await verify();
  if (status !== 200) return NextResponse.json({ error: "Accès refusé" }, { status });
  const { id } = await req.json().catch(() => ({}));
  if (typeof id !== "string" || !id) return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  const admin = await auth();
  if (!admin?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  try {
    await prisma.$transaction(async (tx) => {
      const deleted = await tx.userRole.delete({ where: { id } });
      await tx.log.create({ data: {
        userId: admin.user.id,
        actorUsername: admin.user.username || admin.user.name || null,
        action: "DELETE",
        entity: "UserRole",
        entityId: deleted.id,
        route: "/roles",
        details: `Suppression de permission ${deleted.name} pour ${deleted.userId}`,
      } });
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Permission introuvable ou suppression impossible" }, { status: 404 });
  }
}
