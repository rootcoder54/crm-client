import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { requireRoleAdmin } from "@/lib/permissions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const isAll = req.nextUrl.searchParams.get("all") === "true";
  if (isAll) {
    try { await requireRoleAdmin(); }
    catch { return NextResponse.json({ error: "Accès interdit" }, { status: 403 }); }
  }

  const page = Math.max(1, Math.min(100000, Number(req.nextUrl.searchParams.get("page")) || 1));
  const pageSize = Math.max(1, Math.min(100, Number(req.nextUrl.searchParams.get("limit")) || 30));
  const action = req.nextUrl.searchParams.get("action") || undefined;
  const entity = req.nextUrl.searchParams.get("entity") || undefined;
  const where = {
    ...(!isAll ? { userId: session.user.id } : {}),
    ...(action ? { action } : {}),
    ...(entity ? { entity } : {}),
  };
  const [logs, total] = await Promise.all([
    prisma.log.findMany({
      where,
      select: { id: true, action: true, entity: true, entityId: true, route: true, details: true, timestamp: true, actorUsername: true, userId: true },
      orderBy: [{ timestamp: "desc" }, { id: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.log.count({ where }),
  ]);
  return NextResponse.json({ logs, total, page, pageSize });
}
