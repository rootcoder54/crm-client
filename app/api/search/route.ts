import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json({ results: [] });
  }
  const q = query.toLowerCase();

  try {
    // Recherches parallèles
    const [clients, contacts, contrats, interventions, requetes, factures] =
      await Promise.all([
        prisma.client.findMany({
          where: {
            OR: [
              { nomClient: { contains: q } },
              { sigle: { contains: q } },
              { adresse: { contains: q } },
              { telephone: { contains: q } },
              { activite: { contains: q } }
            ]
          },
          select: {
            id: true,
            nomClient: true,
            sigle: true,
            telephone: true,
            adresse: true
          }
        }),

        prisma.contact.findMany({
          where: {
            OR: [
              { nom: { contains: q } },
              { telephone: { contains: q } },
              { email: { contains: q } },
              { poste: { contains: q } }
            ]
          },
          select: {
            id: true,
            nom: true,
            email: true,
            telephone: true,
            clientId: true,
            client: true
          }
        }),

        prisma.contrat.findMany({
          where: {
            OR: [{ type: { contains: q } }, { reconduction: { contains: q } }]
          },
          select: {
            id: true,
            type: true,
            dateDebut: true,
            dateFin: true,
            clientId: true,
            client: true
          }
        }),

        prisma.intervention.findMany({
          where: {
            OR: [
              { numero: { contains: q } },
              { service: { contains: q } },
              { intervenant: { contains: q } },
              { nature: { contains: q } },
              { observations: { contains: q } }
            ]
          },
          select: {
            id: true,
            numero: true,
            service: true,
            intervenant: true,
            clientId: true,
            client: true
          }
        }),

        prisma.requete.findMany({
          where: {
            OR: [
              { sujet: { contains: q } },
              { description: { contains: q } },
              { observation: { contains: q } },
              { logiciel: { contains: q } },
              { technicien: { contains: q } },
              { demandeur: { contains: q } }
            ]
          },
          select: {
            id: true,
            sujet: true,
            type: true,
            technicien: true,
            demandeur: true,
            clientId: true,
            client: true
          }
        }),

        prisma.facture.findMany({
          where: {
            OR: [
              { numero: { contains: q } },
              { type: { contains: q } },
              { modeReglement: { contains: q } },
              { observation: { contains: q } },
              { devise: { contains: q } }
            ]
          },
          select: {
            id: true,
            numero: true,
            date: true,
            totalTTC: true,
            clientId: true,
            client: true
          }
        })
      ]);

    /*const results = [
      ...clients.map((c) => ({ type: "Client", data: c })),
      ...contacts.map((c) => ({ type: "Contact", data: c })),
      ...contrats.map((c) => ({ type: "Contrat", data: c })),
      ...interventions.map((i) => ({ type: "Intervention", data: i })),
      ...requetes.map((r) => ({ type: "Requete", data: r })),
      ...factures.map((f) => ({ type: "Facture", data: f }))
    ];*/

    return NextResponse.json({
      clients,
      contacts,
      contrats,
      interventions,
      requetes,
      factures
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
