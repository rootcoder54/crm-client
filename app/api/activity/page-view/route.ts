import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { canAccess } from "@/lib/permissions";
import { auditRead } from "@/lib/audit";
import { auditMessage } from "@/lib/audit-messages";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const pageSchema = z.object({
  pathname: z.string().min(1).max(240).regex(/^\/[a-zA-Z0-9/_-]*$/),
});

const indexPages: Record<string, { entity: string; permission: string; title: string }> = {
  "/": { entity: "Accueil", permission: "/", title: "Consultation du tableau de bord" },
  "/client": { entity: "Client", permission: "/client", title: "Consultation de la page Clients" },
  "/requete": { entity: "Requete", permission: "/requete", title: "Consultation de la page Requêtes" },
  "/facture": { entity: "Facture", permission: "/facture", title: "Consultation de la page Factures" },
  "/intervention": { entity: "Intervention", permission: "/intervention", title: "Consultation de la page Interventions" },
  "/draft": { entity: "Requete", permission: "/requete", title: "Consultation de la page Brouillons" },
  "/employe": { entity: "User", permission: "/employe", title: "Consultation de la page Équipe" },
  "/licence": { entity: "Licence", permission: "/licence", title: "Consultation de la page Licences" },
  "/importation": { entity: "Client", permission: "/importation", title: "Consultation de la page Importations" },
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const parsed = pageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Chemin invalide" }, { status: 400 });

  const pathname = parsed.data.pathname.replace(/\/$/, "") || "/";
  const index = indexPages[pathname];
  let entity = index?.entity;
  let entityId: string | null = null;
  let permission = index?.permission;
  let title = index?.title;

  // Seulement des routes prévues par le CRM. Ne jamais accepter une
  // description libre ni un userId envoyés par le navigateur.
  const detail = pathname.match(/^\/(requete\/detail|client\/detail|facture\/details|draft)\/([a-zA-Z0-9_-]{6,100})$/);
  if (!index && detail) {
    const type = detail[1];
    const id = detail[2];
    entityId = id;
    if (type === "requete/detail" || type === "draft") {
      entity = "Requete";
      permission = "/requete";
    } else if (type === "client/detail") {
      entity = "Client";
      permission = "/client";
    } else {
      entity = "Facture";
      permission = "/facture";
    }
  }

  if (!entity || !permission) return new NextResponse(null, { status: 204 });
  if (!(await canAccess(session.user.id, permission, "read"))) {
    return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
  }

  // Le libellé est recherché en base : l'utilisateur ne peut pas inventer
  // un sujet ou récupérer les titres de fiches auxquelles il n'a pas accès.
  if (detail && entityId) {
    if (entity === "Requete") {
      const requestRow = await prisma.requete.findUnique({ where: { id: entityId }, select: { sujet: true } });
      if (!requestRow) return new NextResponse(null, { status: 404 });
      title = auditMessage("READ", "Requete", requestRow.sujet);
    } else if (entity === "Client") {
      const client = await prisma.client.findUnique({ where: { id: entityId }, select: { nomClient: true } });
      if (!client) return new NextResponse(null, { status: 404 });
      title = auditMessage("READ", "Client", client.nomClient);
    } else if (entity === "Facture") {
      const invoice = await prisma.facture.findUnique({ where: { id: entityId }, select: { numero: true } });
      if (!invoice) return new NextResponse(null, { status: 404 });
      title = auditMessage("READ", "Facture", invoice.numero);
    }
  }

  await auditRead({ entity, entityId, route: pathname, details: title });
  return new NextResponse(null, { status: 204 });
}
