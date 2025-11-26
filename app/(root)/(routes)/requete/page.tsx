"use client";
import { Client, Requete } from "@prisma/client";
import {
  AlertCircleIcon,
  ChartPie,
  FileBox,
  LayoutGrid,
  Plus,
  Trash
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/datatables";
import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RiFileExcel2Line } from "react-icons/ri";
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
    queryKey: ["requete"],
    queryFn: () => fetcher(`/api/requete`)
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
      numero:
        format(requete.dateDebut || new Date(), "yyyyMMdd_") +
        requete.client?.numero +
        "_" +
        requete.logiciel +
        "_#",
      etat: requete.dateCloture ? "Cloturée" : "En cours",
      client: requete.client?.nomClient || "N/A"
    })) || [];

  return (
    <DataTable
      chemins={[
        { title: "Requête", url: "/requete" },
        { title: "Listes", url: "#" }
      ]}
      titre="Liste des Requêtes"
      action={[
        {
          label: "Nouvelle Requête",
          icon: <Plus />,
          url: "/requete/add",
          variantbtn: "blue"
        },
        {
          label: "Excel",
          icon: <RiFileExcel2Line />,
          url: "/api/export/requete",
          variantbtn: "green",
          target: true
        }
      ]}
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
      data={listes}
      dateChose="dateDebut"
      dateChoseTitle="Filter par Date"
      columnStyles={{
        sujet: (value) => (
          <span className="font-medium">{value as string}</span>
        ),
        etat: (value) => (
          <Badge
            variant={"default"}
            className={cn(value !== "Cloturée" && "bg-yellow-400 text-black")}
          >
            {value as string}
          </Badge>
        ),
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
        "status"
      ]}
      searchId="sujet"
      searchPlaceholder="Rechercher un sujet..."
      popFilter={[
        {
          dataFilter: "etat",
          icon: <ChartPie />,
          options: [
            { label: "En cours", value: "En cours" },
            { label: "Cloturée", value: "Cloturée" }
          ]
        },
        {
          dataFilter: "logiciel",
          icon: <LayoutGrid />,
          options: [
            { label: "RHPaie", value: "RHPaie" },
            { label: "TimeSheet", value: "TimeSheet" },
            { label: "RHData", value: "RHData" },
            { label: "RHFacture", value: "RHFacture" }
          ]
        }
      ]}
      onRowSelect={(id) => setSelectedId(id)}
      exportName="liste_requetes"
    />
  );
};

export default PageRequete;
