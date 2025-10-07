"use client";

import { DataTable } from "@/components/datatables";
import { Spinner } from "@/components/ui/spinner";
import { fetcher } from "@/lib/fetcher";
import { Client } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { FileArchive, Plus, SquarePen, Trash } from "lucide-react";
import { useState } from "react";

const ClientPage = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const { data: clients } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => fetcher(`/api/client`)
  });

  if (!clients) {
    return (
      <div className="h-24 flex items-center w-full justify-center text-center">
        <Spinner className="size-8" />
      </div>
    );
  }
  return (
    <DataTable
      chemins={[
        { title: "Clients", url: "/client" },
        { title: "Listes", url: "#" }
      ]}
      action={[
        {
          label: "Nouvelle Client",
          icon: <Plus />,
          url: "/client/add",
          variantbtn: "secondary"
        }
      ]}
      selectAction={[
        {
          label: "Interventions",
          icon: <FileArchive />,
          url: `/client/intervention/${selectedId}`,
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
      data={clients}
      hideList={[
        "createdAt",
        "updatedAt",
        "adresse",
        "sigle",
        "dateInscription",
        "dateNewVisite"
      ]}
      searchId="nomClient"
      searchPlaceholder="Rechercher une nom de client"
      notData="Aucun client trouvé"
      onRowSelect={(id) => setSelectedId(id)}
    />
  );
};

export default ClientPage;
