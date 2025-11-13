"use client";

import { DataTable } from "@/components/datatables";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderOne } from "@/components/ui/loader";
import { fetcher } from "@/lib/fetcher";
import { Client } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertCircleIcon,
  FileChartPie,
  Plus,
  SquarePen,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { RiFileExcel2Line } from "react-icons/ri";

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
  const dataFiltered = Array.from(
    new Map(
      (clients ?? []).map((client) => [
        client.activite || "N/A",
        {
          label: client.activite || "Pas d'activité",
          value: client.activite || "Pas d'activité"
        }
      ])
    ).values()
  );

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center w-full justify-center text-center">
        <LoaderOne />
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

  return (
    <DataTable
      chemins={[
        { title: "Clients", url: "/client" },
        { title: "Listes", url: "#" }
      ]}
      titre="Liste des clients"
      action={[
        {
          label: "Nouvelle Client",
          icon: <Plus />,
          url: "/client/add",
          variantbtn: "secondary"
        },
        {
          label: "Excel",
          icon: <RiFileExcel2Line />,
          url: "/api/export/client",
          variantbtn: "green",
          target: true
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
          icon: <Trash2 />,
          url: `/client/delete/${selectedId}`,
          variantbtn: "danger"
        }
      ]}
      data={listes || []}
      hideList={[
        "createdAt",
        "updatedAt",
        "adresse",
        "sigle",
        "dateInscription",
        "dateNewVisite",
        "dateLastVisite"
      ]}
      popFilter={[
        {
          dataFilter: "activite",
          icon: <FileChartPie />,
          options: dataFiltered
        }
      ]}
      dateChose="dateLastVisite"
      dateChoseTitle="Filter derniere requete"
      searchId="nomClient"
      searchPlaceholder="Rechercher un nom de client..."
      notData="Aucun client trouvé"
      onRowSelect={(id) => setSelectedId(id)}
      //exportLien="/api/export/client"
      exportName="liste_clients"
    />
  );
};

export default ClientPage;
