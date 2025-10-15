"use client";

import { DataTable } from "@/components/datatables";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetcher } from "@/lib/fetcher";
import { Facture } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, FileBox, Plus, SquarePen, Trash } from "lucide-react";
import { useState } from "react";

const PageFacture = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const {
    isError,
    isPending,
    data: factures
  } = useQuery<Facture[]>({
    queryKey: ["facture"],
    queryFn: () => fetcher(`/api/facture`)
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
            <p>Une erreur est survenue lors du chargement des factures.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <DataTable
      chemins={[
        { title: "Factures", url: "/facture" },
        { title: "Listes", url: "#" }
      ]}
      action={[
        {
          label: "Nouvelle Facture",
          icon: <Plus />,
          url: "/facture/add",
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
          url: `/facture/delete/${selectedId}`,
          variantbtn: "danger"
        }
      ]}
      data={factures || []}
      hideList={[
        "createdAt",
        "updatedAt",
        "clientId",
        "date",
        "remise",
        "observation",
        "totalTTC",
        "totalHT",
        "totalTVA",
        "itemFactures"
      ]}
      onRowSelect={(id) => setSelectedId(id)}
    />
  );
};

export default PageFacture;
