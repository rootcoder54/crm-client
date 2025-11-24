"use client";
import { Client, Requete } from "@prisma/client";
import { AlertCircleIcon, FileBox } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/datatables";
import { useState } from "react";
import { LoaderOne } from "@/components/ui/loader";

interface RequeteWithClient extends Requete {
  client?: Client | null;
}

const PageRequete = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const {
    isError,
    isPending,
    data: requetes
  } = useQuery<RequeteWithClient[]>({
    queryKey: ["requeteDraft"],
    queryFn: () => fetcher(`/api/requete/draft`)
  });

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
            <p>Une erreur est survenue lors du chargement des requêtes.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  const listes =
    requetes?.map((requete) => ({
      ...requete,
      client: requete.client?.nomClient || "Pas de client"
    })) || [];

  return (
    <DataTable
      chemins={[
        { title: "Requête", url: "/requete" },
        { title: "Requête Brouillon", url: "/requete/draft" }
      ]}
      titre="Liste des Requêtes Brouillons"
      selectAction={[
        {
          label: "Details",
          icon: <FileBox />,
          url: `/requete/detail/${selectedId}`,
          variantbtn: "blue"
        }
      ]}
      data={listes}
      dateChose="dateDebut"
      dateChoseTitle="Filter par Date"
      columnStyles={{
        type: (value) => <span className="uppercase">{value as string}</span>
      }}
      hideList={[
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
        "etat",
        "status"
      ]}
      searchId="sujet"
      searchPlaceholder="Rechercher un sujet..."
      onRowSelect={(id) => setSelectedId(id)}
      exportName="liste_requetes"
    />
  );
};

export default PageRequete;
