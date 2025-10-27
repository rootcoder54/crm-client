"use client";

import { DataTable } from "@/components/datatables";
import HeaderPage from "@/components/features/header-page";
import { Badge } from "@/components/ui/badge";

import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { Client, Requete } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  FileArchive,
  FileBox,
  LayoutGrid,
  SquarePen,
  Trash
} from "lucide-react";
import { useState } from "react";

interface RequeteWithClient extends Requete {
  client?: Client | null;
}

export default function Home() {
  const [selectedId, setSelectedId] = useState<string>("");

  const { data: requetes } = useQuery<RequeteWithClient[]>({
    queryKey: ["requete"],
    queryFn: () => fetcher(`/api/requete`)
  });

  const mlistes = requetes?.filter((res) => !res.dateCloture);
  const listes =
    mlistes?.map((requete) => ({
      ...requete,
      numero:
        format(requete.dateDebut, "yyyyMMdd_") +
        requete.client?.numero +
        "_" +
        requete.logiciel +
        "_#",
      etat: requete.dateCloture ? "Cloturée" : "En cours",
      client: requete.client?.nomClient || "N/A"
    })) || [];
  console.log(listes);
  return (
    <div>
      <HeaderPage chemins={[{ title: "Home", url: "/" }]}></HeaderPage>
      <div className="flex-1 h-full p-4">
        <h1 className="text-xl text-blue-500 font-bold">Requête en cours</h1>
        <p>Bienvenue sur la page d&apos;accueil de notre application !</p>
        <hr className="my-5" />
        <div className="flex flex-row items-center justify-center gap-4">
          <DataTable
            isHeader={false}
            data={listes || []}
            dateChose="dateDebut"
            dateChoseTitle="Filter par Date"
            selectAction={[
              {
                label: "Interventions",
                icon: <FileArchive />,
                url: `/requete/intervention/${selectedId}`,
                variantbtn: "blue"
              },
              {
                label: "Details",
                icon: <FileBox />,
                url: `/requete/detail/${selectedId}`,
                variantbtn: "blue"
              },
              {
                label: "Editer",
                icon: <SquarePen />,
                url: `/requete/edite/${selectedId}`,
                variantbtn: "outline"
              },
              {
                label: "Supprimer",
                icon: <Trash />,
                url: `/requete/delete/${selectedId}`,
                variantbtn: "danger"
              }
            ]}
            columnStyles={{
              etat: (value) => (
                <Badge
                  variant={"default"}
                  className={cn(
                    value !== "Cloturée" && "bg-yellow-400 text-black"
                  )}
                >
                  {value as string}
                </Badge>
              ),
              type: (value) => (
                <span className="uppercase">{value as string}</span>
              )
            }}
            hideList={[
              "etat",
              "createdAt",
              "updatedAt",
              "dateCloture",
              "Intervention",
              "logiciel",
              "observation",
              "clientId",
              "dateDebut",
              "description",
              "isTacheClient"
            ]}
            searchId="sujet"
            searchPlaceholder="Rechercher un sujet..."
            popFilter={[
              {
                dataFilter: "logiciel",
                icon: <LayoutGrid />,
                options: [
                  { label: "RHPaie", value: "RHPaie" },
                  { label: "TimeSheet", value: "TimeSheet" },
                  { label: "RHData", value: "RHData" },
                  { label: "RHFacture", value: "RHfacture" }
                ]
              }
            ]}
            onRowSelect={(id) => setSelectedId(id)}
          />
        </div>
      </div>
    </div>
  );
}
