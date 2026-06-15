"use client";

import { DataTable } from "@/components/datatables";
import HeaderPage from "@/components/features/header-page";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

import { fetcher } from "@/lib/fetcher";
import { Requete } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FileBox, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface RequeteWithClient extends Requete {
  [key: string]: unknown;
  client: string;
  date: Date | null;
  etat: string;
  numero: string;
}

export default function Home() {
  const [selectedId, setSelectedId] = useState<string>("");

  const { data: requetes } = useQuery<RequeteWithClient[]>({
    queryKey: ["requete", "encours"],
    queryFn: () => fetcher(`/api/requete/encours`)
  });
  
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
            chemins={[
              { title: "Requête", url: "/requete" },
              { title: "Listes", url: "#" }
            ]}
            titre="Liste des Requêtes"
            onDoubleClickLink={`/requete/detail/${selectedId}`}
            action={[
              {
                label: "Nouvelle Requête",
                icon: <Plus />,
                url: "/requete/add",
                variantbtn: "default"
              }
            ]}
            selectAction={[
              {
                label: "Details",
                icon: <FileBox />,
                url: `/requete/detail/${selectedId}`,
                variantbtn: "outline"
              },
              {
                label: "Supprimer",
                icon: <Trash />,
                url: `/requete/delete/${selectedId}`,
                variantbtn: "danger"
              }
            ]}
            data={requetes || []}
            dateChose="dateDebut"
            dateChoseTitle="Filter par Date"
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
              type: (value) => (
                <span className="uppercase">{value as string}</span>
              )
            }}
            searchId="sujet"
            searchPlaceholder="Rechercher un sujet..."
            onRowSelect={(id) => setSelectedId(id)}
            exportName="liste_requetes"
            storageKey="requete-datatable"
          />
        </div>
      </div>
    </div>
  );
}
