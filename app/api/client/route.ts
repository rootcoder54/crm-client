import { getAllClients } from "@/services/client.service";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const clients = await getAllClients();

    const listes = clients
        ?.sort((a, b) => {
          if (!a.dateLastVisite) return 1;
          if (!b.dateLastVisite) return -1;
          const dateA = new Date(a.dateLastVisite);
          const dateB = new Date(b.dateLastVisite);
          return dateB.getTime() - dateA.getTime(); // plus récent en premier
        })
        .map((client) => ({
          ...client,
          dateRequete: client.dateLastVisite
            ? format(new Date(client.dateLastVisite), "dd MMM yyyy", {
                locale: fr
              })
            : null,
          numero: client.numero,
          activite: client.activite || "Pas d'activité"
        }));

    return NextResponse.json(listes);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
