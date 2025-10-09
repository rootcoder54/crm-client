"use client";
import { Requete } from "@prisma/client";
import {
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
import { DataTable } from "@/components/datatables";
import { useEffect, useState } from "react";
import { getRequeteById } from "@/services/requete.service";
import { format } from "date-fns";

const PageRequete = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [isCloture, setIscloture] = useState<boolean>(false);
  const { data: requetes } = useQuery<Requete[]>({
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

  if (!requetes) {
    return (
      <div className="h-24 flex items-center w-full justify-center text-center">
        <Spinner className="size-8" />
      </div>
    );
  }
  const nrequetes = requetes.map((requete) => ({
    ...requete,
    numero:
      format(requete.dateDebut, "yyyyMMdd_HHss") + "_" + requete.logiciel + "_#"
  }));
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
        "etat",
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
