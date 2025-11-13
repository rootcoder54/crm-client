"use client";

import { DataTable } from "@/components/datatables";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetcher } from "@/lib/fetcher";
import { Article } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, FileBox, Plus, SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import { LoaderOne } from "@/components/ui/loader";

const PageFrequente = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const {
    isError,
    isPending,
    data: articles
  } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: () => fetcher(`/api/article`)
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
            <p>Une erreur est survenue lors du chargement des Articles.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <DataTable
      chemins={[
        { title: "Questions Frequentes", url: "/frequents" },
        { title: "Listes", url: "#" }
      ]}
      action={[
        {
          label: "Nouvelle Article",
          icon: <Plus />,
          url: "/frequents/add",
          variantbtn: "secondary"
        }
      ]}
      selectAction={[
        {
          label: "Details",
          icon: <FileBox />,
          url: `#`,
          variantbtn: "blue"
        },
        {
          label: "Editer",
          icon: <SquarePen />,
          url: `#`,
          variantbtn: "outline"
        },
        {
          label: "Supprimer",
          icon: <Trash />,
          url: `/frequents/delete/${selectedId}`,
          variantbtn: "danger"
        }
      ]}
      data={articles || []}
      hideList={["createdAt", "updatedAt", "contenu"]}
      onRowSelect={(id) => setSelectedId(id)}
      searchId="titre"
      searchPlaceholder="Recherche le titre..."
    />
  );
};

export default PageFrequente;
