import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { canAccess } from "@/lib/permissions";
import {
  cellText, dateCell, importResponse, ImportFileError,
  lookupClient, numberCell, readExcelImport, requiredText,
  type ImportIssue,
} from "@/lib/import-excel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    if (!(await canAccess(session.user.id, "/requete", "create")) ||
        !(await canAccess(session.user.id, "/importation", "create")))
      return NextResponse.json({ message: "Accès refusé : création de requêtes non autorisée" }, { status: 403 });

    const form = await request.formData();
    const { lines } = await readExcelImport(
      form.get("file"), ["sujet"], [["clientId", "clientNumero", "numeroClient", "nomClient"]],
    );
    const clients = await prisma.client.findMany({
      select: { id: true, numero: true, nomClient: true },
    });
    let imported = 0;
    const ignored: ImportIssue[] = [];
    const seen = new Set<string>();
    for (const { ligne, row } of lines) {
      try {
        const sujet = requiredText(row, "sujet");
        const client = lookupClient(row, clients);
        const dateDebut = dateCell(row.dateDebut, "dateDebut");
        const dateCloture = dateCell(row.dateCloture, "dateCloture");
        if (dateCloture && dateDebut && dateCloture < dateDebut)
          throw new Error("La date de clôture précède la date de début");
        const status = cellText(row.status).toLowerCase() || "submitted";
        if (!["draft", "submitted"].includes(status))
          throw new Error("Le statut doit être draft ou submitted");
        const isTacheClient = cellText(row.isTacheClient).toLowerCase();
        if (isTacheClient && !["oui", "non", "true", "false", "1", "0"].includes(isTacheClient))
          throw new Error("isTacheClient doit être oui ou non");
        const description = cellText(row.description);
        const key = JSON.stringify([client.id, sujet.toLowerCase(), dateDebut?.toISOString() ?? "", description.toLowerCase()]);
        if (seen.has(key)) throw new Error("Doublon dans le fichier");
        seen.add(key);
        const existing = await prisma.requete.findFirst({
          where: { clientId: client.id, sujet, dateDebut, description: description || null },
          select: { id: true },
        });
        if (existing) throw new Error("Requête déjà présente dans la base");
        await prisma.$transaction(async (tx) => {
          const requete = await tx.requete.create({
            data: {
              sujet,
              clientId: client.id,
              description: description || null,
              type: cellText(row.type) || null,
              observation: cellText(row.observation) || null,
              logiciel: cellText(row.logiciel) || null,
              demandeur: cellText(row.demandeur) || null,
              technicien: cellText(row.technicien) || null,
              dateDebut,
              dateCloture,
              etat: cellText(row.etat) || null,
              status,
              isTacheClient: !["non", "false", "0"].includes(isTacheClient),
            },
          });
          await tx.log.create({
            data: {
              userId: session.user.id,
              actorUsername: session.user.username || session.user.name || null,
              action: "CREATE",
              entity: "Requete",
              entityId: requete.id,
              route: "/requete",
              details: "Création de la requête (" + sujet.slice(0, 180) + ") par importation Excel",
            },
          });
        });
        imported++;
      } catch (error) {
        ignored.push({ ligne, raison: error instanceof Error ? error.message : "Erreur d'importation" });
      }
    }
    return NextResponse.json(importResponse(imported, ignored.length, ignored));
  } catch (error) {
    if (error instanceof ImportFileError)
      return NextResponse.json({ message: error.message, colonnesManquantes: error.colonnesManquantes }, { status: error.status });
    console.error("Importation de requêtes :", error);
    return NextResponse.json({ message: "Erreur lors de l'importation des requêtes" }, { status: 500 });
  }
}
