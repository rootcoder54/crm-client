"use client";
import { Requete } from "@prisma/client";
import { FileArchive, Plus, SquarePen, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { Spinner } from "@/components/spinner";
import { DataTable } from "@/components/datatables";
import { useState } from "react";

const PageRequete = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const { data: requetes } = useQuery<Requete[]>({
    queryKey: ["requeteid"],
    queryFn: () => fetcher(`/api/requete`)
  });
  if (!requetes) {
    return (
      <div className="h-24 flex items-center w-full justify-center text-center">
        <Spinner />
      </div>
    );
  }
  return (
    <DataTable
      chemins={[
        { title: "Requête", url: "/requete" },
        { title: "Listes", url: "#" }
      ]}
      action={[
        {
          label: "Nouvelle Requête",
          icon: <Plus />,
          url: "/requete/add",
          variantbtn: "secondary"
        }
      ]}
      selectAction={[
        {
          label: "Interventions",
          icon: <FileArchive />,
          url: `/requete/intervention/${selectedId}`,
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
      data={requetes}
      hideList={[
        "createdAt",
        "updatedAt",
        "client",
        "etat",
        "dateCloture",
        "Intervention",
        "dateDebut",
        "logiciel",
        "observation",
        "clientId",
        "isTacheClient"
      ]}
      searchId="sujet"
      searchPlaceholder="Rechercher une requête"
      onRowSelect={(id) => setSelectedId(id)}
    />
  );
};

export default PageRequete;
