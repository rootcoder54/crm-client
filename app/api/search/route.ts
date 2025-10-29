import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Recherches parallèles
    const [clients, contacts, contrats, interventions, requetes, factures] =
      await Promise.all([
        prisma.client.findMany({
          where: {
            OR: [
              { nomClient: { contains: query, mode: "insensitive" } },
              { sigle: { contains: query, mode: "insensitive" } },
              { adresse: { contains: query, mode: "insensitive" } },
              { telephone: { contains: query, mode: "insensitive" } },
              { activite: { contains: query, mode: "insensitive" } }
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
              { nom: { contains: query, mode: "insensitive" } },
              { telephone: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
              { poste: { contains: query, mode: "insensitive" } }
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
            OR: [
              { type: { contains: query, mode: "insensitive" } },
              { reconduction: { contains: query, mode: "insensitive" } }
            ]
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
              { numero: { contains: query, mode: "insensitive" } },
              { service: { contains: query, mode: "insensitive" } },
              { intervenant: { contains: query, mode: "insensitive" } },
              { nature: { contains: query, mode: "insensitive" } },
              { observations: { contains: query, mode: "insensitive" } }
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
              { sujet: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { observation: { contains: query, mode: "insensitive" } },
              { logiciel: { contains: query, mode: "insensitive" } },
              { technicien: { contains: query, mode: "insensitive" } },
              { demandeur: { contains: query, mode: "insensitive" } }
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
              { numero: { contains: query, mode: "insensitive" } },
              { type: { contains: query, mode: "insensitive" } },
              { modeReglement: { contains: query, mode: "insensitive" } },
              { observation: { contains: query, mode: "insensitive" } },
              { devise: { contains: query, mode: "insensitive" } }
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
