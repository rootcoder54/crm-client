import { getAllClients } from "@/services/client.service";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clients = await getAllClients();

    const listes = clients
      .map((client) => ({
        ...client,
        derniereRequete:
          client.Requete && client.Requete.length > 0 && client.dateLastVisite
            ? format(new Date(client.dateLastVisite), "dd MMM yyyy", {
                locale: fr
              })
            : null,
        numero: client.numero,
        activite: client.activite || "Pas d'activité",
        Requete:
          client.Requete && client.Requete.length > 0
            ? "" + client.Requete.length + " requete(s)"
            : null
      }))
      .sort((a, b) => {
        if (!a.derniereRequete) return 1;
        if (!b.derniereRequete) return -1;
        const dateA = new Date(a.derniereRequete);
        const dateB = new Date(b.derniereRequete);
        return dateB.getTime() - dateA.getTime(); // plus récent en premier
      });

    return NextResponse.json(listes);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
