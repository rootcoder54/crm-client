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
    const role = await prisma.userRole.upsert({
      where: { userId_name: { userId, name } },
      create: { userId, name, url: url || null, accessLevel },
      update: { url: url || null, accessLevel },
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
  await prisma.userRole.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
