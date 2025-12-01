"use client";

import { DataTable } from "@/components/datatables";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetcher } from "@/lib/fetcher";
import { Article } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, FileBox, Plus, SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import { LoaderOne } from "@/components/ui/loader";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

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
          url: `/frequents/details/${selectedId}`,
          variantbtn: "blue"
        },
        {
          label: "Editer",
          icon: <SquarePen />,
          url: `/frequents/edite/${selectedId}`,
          variantbtn: "outline"
        },
        {
          label: "Supprimer",
          icon: <Trash />,
          url: `/frequents/delete/${selectedId}`,
          variantbtn: "danger"
        }
      ]}
      columnStyles={{
        titre: (value, row) => (
          <Link
            href={`/frequents/details/${row.id}`}
            className="font-medium hover:underline"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  {row.titre.length > 30
                    ? row.titre.slice(0, 30) + "..."
                    : row.titre}
                </span>
              </TooltipTrigger>
              <TooltipContent className="w-[560px] p-4" side="bottom">
                <p>{value as string}</p>
              </TooltipContent>
            </Tooltip>
          </Link>
        )
      }}
      data={articles || []}
      hideList={["createdAt", "updatedAt", "contenu"]}
      onRowSelect={(id) => setSelectedId(id)}
      searchId="titre"
      searchPlaceholder="Recherche le titre..."
    />
  );
};

export default PageFrequente;
