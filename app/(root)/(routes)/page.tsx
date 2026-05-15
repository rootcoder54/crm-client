"use client";

import { DataTable } from "@/components/datatables";
import HeaderPage from "@/components/features/header-page";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

import { fetcher } from "@/lib/fetcher";
import { Client, Requete } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FileBox, LayoutGrid, Trash } from "lucide-react";
import Link from "next/link";
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
      date: requete.dateDebut,
      numero:
        format(requete.dateDebut || new Date(), "yyyyMMdd_") +
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
            titre="Requête en cours"
            selectAction={[
              {
                label: "Details",
                icon: <FileBox />,
                url: `/requete/detail/${selectedId}`,
                variantbtn: "blue"
              },
              {
                label: "Supprimer",
                icon: <Trash />,
                url: `/requete/delete/${selectedId}`,
                variantbtn: "danger"
              }
            ]}
            onDoubleClickLink={`/requete/detail/${selectedId}`}
            columnStyles={{
              sujet: (value, row) => (
                <Link
                  href={`/requete/detail/${row.id}`}
                  className="font-medium hover:underline"
                >
                  {row.sujet && row.sujet.length > 30 ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{row.sujet.slice(0, 30) + "..."}</span>
                      </TooltipTrigger>
                      <TooltipContent className="w-[560px] p-4" side="bottom">
                        <p>{value as string}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span>{value as string}</span>
                  )}
                </Link>
              ),
              date: (value) => format(new Date(value as string), "dd/MM/yyyy"),
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
              "isTacheClient",
              "status",
              "type"
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
