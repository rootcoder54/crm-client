"use client";

import { DataTable } from "@/components/datatables";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { fetcher } from "@/lib/fetcher";
import { Client } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, Plus, SquarePen, Trash } from "lucide-react";
import { useState } from "react";

const ClientPage = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const {
    isPending,
    isError,
    data: clients
  } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => fetcher(`/api/client`)
  });

  if (isPending) {
    return (
      <div className="h-24 flex items-center w-full justify-center text-center">
        <Spinner className="size-8" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="m-4">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle> Erreur de donnée </AlertTitle>
          <AlertDescription>
            <p>Une erreur est survenue lors du chargement des clients.</p>
          </AlertDescription>
        </Alert>
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
          label: "Details",
          icon: <SquarePen />,
          url: `/client/detail/${selectedId}`,
          variantbtn: "outline"
        },
        {
          label: "Supprimer",
          icon: <Trash />,
          url: `/client/delete/${selectedId}`,
          variantbtn: "danger"
        }
      ]}
      data={clients || []}
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
