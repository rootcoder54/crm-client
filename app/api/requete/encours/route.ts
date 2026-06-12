import { NextResponse } from "next/server";

import { getSubmittedRequetes } from "@/services/requete.service";
import { format } from "date-fns";

export async function GET() {
  try {
    const requetes = await getSubmittedRequetes();
    const listes =
      requetes?.map((requete) => ({
        ...requete,
        date: requete.dateDebut,
        etat: requete.dateCloture ? "Cloturée" : "En cours",
        //nomClient: requete.demandeur + "-" + requete.client?.nomClient || "N/A",
        client: requete.client?.nomClient || "N/A",
        numero:
          format(requete.dateDebut || new Date(), "yyyyMMdd_") +
          requete.client?.numero +
          "_" +
          requete.logiciel +
          "_#"
      })) || [];
      const listeE = listes?.filter((res) => !res.dateCloture);

    return NextResponse.json(listeE);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
