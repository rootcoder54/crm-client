"use client";

import { DataTable } from "@/components/datatables";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetcher } from "@/lib/fetcher";
import { Video } from "@prisma/client";
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

const PageVideoAstuce = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const {
    isError,
    isPending,
    data: videos
  } = useQuery<Video[]>({
    queryKey: ["videos"],
    queryFn: () => fetcher(`/api/video`)
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
            <p>Une erreur est survenue lors du chargement des Videos.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <DataTable
      chemins={[
        { title: "Videos", url: "/video" },
        { title: "Listes", url: "#" }
      ]}
      action={[
        {
          label: "Nouvelle Video",
          icon: <Plus />,
          url: "/video/add",
          variantbtn: "default"
        }
      ]}
      selectAction={[
        {
          label: "Details",
          icon: <FileBox />,
          url: `/video/details/${selectedId}`,
          variantbtn: "blue"
        },
        {
          label: "Editer",
          icon: <SquarePen />,
          url: `/video/edite/${selectedId}`,
          variantbtn: "outline"
        },
        {
          label: "Supprimer",
          icon: <Trash />,
          url: `/video/delete/${selectedId}`,
          variantbtn: "danger"
        }
      ]}
      columnStyles={{
        nom: (value, row) => (
          <Link
            href={`/video/details/${row.id}`}
            className="font-medium hover:underline"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  {row.nom.length > 30 ? row.nom.slice(0, 30) + "..." : row.nom}
                </span>
              </TooltipTrigger>
              <TooltipContent className="w-[560px] p-4" side="bottom">
                <p>{value as string}</p>
              </TooltipContent>
            </Tooltip>
          </Link>
        )
      }}
      data={videos || []}
      hideList={["createdAt", "updatedAt", "detail", "url"]}
      onRowSelect={(id) => setSelectedId(id)}
      searchId="nom"
      searchPlaceholder="Recherche le nom..."
    />
  );
};

export default PageVideoAstuce;
