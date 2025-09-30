"use client";
import { Requete } from "@prisma/client";
import {
  CalendarCheck2,
  FileArchive,
  Plus,
  SquarePen,
  Trash
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { Spinner } from "@/components/spinner";
import { DataTable } from "@/components/datatables";
import { useEffect, useState } from "react";
import { getRequeteById } from "@/services/requete.service";

const PageRequete = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [isCloture, setIscloture] = useState<boolean>(false);
  const { data: requetes } = useQuery<Requete[]>({
    queryKey: ["requeteid"],
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
          label: "Clôture",
          icon: <CalendarCheck2 />,
          url: `/requete/cloture/${selectedId}`,
          variantbtn: "gray",
          hide: isCloture
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
