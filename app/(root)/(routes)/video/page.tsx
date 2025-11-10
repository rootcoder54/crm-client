"use client";

import { DataTable } from "@/components/datatables";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetcher } from "@/lib/fetcher";
import { Video } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, FileBox, Plus, SquarePen, Trash } from "lucide-react";
import { useState } from "react";

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
          url: `/video/delete/${selectedId}`,
          variantbtn: "danger"
        }
      ]}
      data={videos || []}
      hideList={["createdAt", "updatedAt", "detail"]}
      onRowSelect={(id) => setSelectedId(id)}
    />
  );
};

export default PageVideoAstuce;
