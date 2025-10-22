"use client";
import { Client, Requete } from "@prisma/client";
import {
  AlertCircleIcon,
  CalendarCheck2,
  FileArchive,
  FileBox,
  Plus,
  SquarePen,
  Trash
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/datatables";
import { useEffect, useState } from "react";
import { getRequeteById } from "@/services/requete.service";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RiFileExcel2Line } from "react-icons/ri";

interface RequeteWithClient extends Requete {
  client?: Client | null;
}

const PageRequete = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [isCloture, setIscloture] = useState<boolean>(false);
  const {
    isError,
    isPending,
    data: requetes
  } = useQuery<RequeteWithClient[]>({
    queryKey: ["requete"],
    queryFn: () => fetcher(`/api/requete`)
  });

  useEffect(() => {
    getRequeteById(selectedId).then((data) => {
      if (data?.dateCloture) {
        setIscloture(true);
      } else {
        setIscloture(false);
      }
    });
  }, [selectedId]);

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
        format(requete.dateDebut, "yyyyMMdd_") +
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
      action={[
        {
          label: "Nouvelle Requête",
          icon: <Plus />,
          url: "/requete/add",
          variantbtn: "secondary"
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
          label: "Interventions",
          icon: <FileArchive />,
          url: `/requete/intervention/${selectedId}`,
          variantbtn: "blue"
        },
        {
          label: "Clôture",
          icon: <CalendarCheck2 />,
          url: `/requete/cloture/${selectedId}`,
          variantbtn: "gray",
          hide: isCloture
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
      data={listes}
      dateChose="dateDebut"
      dateChoseTitle="Filter par Date"
      columnStyles={{
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
        "isTacheClient"
      ]}
      searchId="sujet"
      searchPlaceholder="Rechercher un sujet..."
      popFilter={[
        {
          dataFilter: "etat",
          options: [
            { label: "En cours", value: "En cours" },
            { label: "Cloturée", value: "Cloturée" }
          ]
        }
      ]}
      onRowSelect={(id) => setSelectedId(id)}
      exportLien="/api/export/requete"
    />
  );
};

export default PageRequete;
