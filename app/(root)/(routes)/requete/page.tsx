"use client";
import { Requete } from "@prisma/client";
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

const PageRequete = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [isCloture, setIscloture] = useState<boolean>(false);
  const {
    isError,
    isPending,
    data: requetes
  } = useQuery<Requete[]>({
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
  const nrequetes =
    requetes?.map((requete) => ({
      ...requete,
      numero:
        format(requete.dateDebut, "yyyyMMdd_HHss") +
        "_" +
        requete.logiciel +
        "_#",
      etat: requete.dateCloture ? (
        <Badge>Cloturée</Badge>
      ) : (
        <Badge className="bg-yellow-500 text-black">En cours</Badge>
      )
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
      data={nrequetes}
      hideList={[
        "createdAt",
        "updatedAt",
        "client",
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
      searchPlaceholder="Rechercher une requête"
      onRowSelect={(id) => setSelectedId(id)}
    />
  );
};

export default PageRequete;
