"use client";

import { DataTable } from "@/components/datatables";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetcher } from "@/lib/fetcher";
import { Facture } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, FileBox, Plus, SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import { LoaderOne } from "@/components/ui/loader";

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
            <p>Une erreur est survenue lors du chargement des factures.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  const listes =
    factures?.map((f) => ({
      id: f.id,
      numero: f.numero,
      type: f.type,
      acquittee: f.acquittee,
      numeroOrdre: f.numeroOrdre,
      modeReglement: f.modeReglement,
      devise: f.devise
    })) || [];
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
      data={listes || []}
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
      storageKey="facture-datatable"
    />
  );
};

export default PageFacture;
