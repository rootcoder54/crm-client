import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { legacyAuditMessage } from "@/lib/audit-messages";
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

  // Résoudre en un minimum de requêtes les titres des anciens journaux.
  // Les informations déjà supprimées gardent leur ancien libellé.
  const idsFor = (entity: string) => logs
    .filter((log) => log.entity === entity && !!log.entityId)
    .map((log) => log.entityId as string);
  const [requetes, clients, factures] = await Promise.all([
    idsFor("Requete").length ? prisma.requete.findMany({
      where: { id: { in: idsFor("Requete") } }, select: { id: true, sujet: true },
    }) : [],
    idsFor("Client").length ? prisma.client.findMany({
      where: { id: { in: idsFor("Client") } }, select: { id: true, nomClient: true },
    }) : [],
    idsFor("Facture").length ? prisma.facture.findMany({
      where: { id: { in: idsFor("Facture") } }, select: { id: true, numero: true },
    }) : [],
  ]);
  const titles = new Map([
    ...requetes.map((item) => [`Requete:${item.id}`, item.sujet]),
    ...clients.map((item) => [`Client:${item.id}`, item.nomClient]),
    ...factures.map((item) => [`Facture:${item.id}`, item.numero]),
  ]);
  const formatted = logs.map((log) => ({
    ...log,
    description: legacyAuditMessage(
      log,
      titles.get(`${log.entity}:${log.entityId}`),
    ),
  }));

  return NextResponse.json({ logs: formatted, total, page, pageSize });
}
