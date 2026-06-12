import { NextResponse } from "next/server";

import { getSubmittedRequetes } from "@/services/requete.service";

export async function GET() {
  try {
    const requetes = await getSubmittedRequetes();
    const listes =
      requetes
        ?.filter((res) => !res.dateCloture)
        .map((requete) => ({
          //...requete,
          id: requete.id,
          sujet: requete.sujet,
          demandeur: requete.demandeur,
          technicien: requete.technicien,
          date: requete.dateDebut,
          //etat: requete.dateCloture ? "Cloturée" : "En cours",
          //nomClient: requete.demandeur + "-" + requete.client?.nomClient || "N/A",
          client: requete.client?.nomClient || "N/A",
        })) || [];
    //const listeE = listes?.filter((res) => !res.dateCloture);

    return NextResponse.json(listes);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
