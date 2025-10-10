"use client";

import { DataTable } from "@/components/datatables";
import { Spinner } from "@/components/ui/spinner";
import { fetcher } from "@/lib/fetcher";
import { Facture } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { FileBox, Plus, SquarePen, Trash } from "lucide-react";
import { useState } from "react";

const PageFacture = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const { data: factures } = useQuery<Facture[]>({
    queryKey: ["facture"],
    queryFn: () => fetcher(`/api/facture`)
  });
  if (!factures) {
    return (
      <div className="h-24 flex items-center w-full justify-center text-center">
        <Spinner className="size-8" />
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
      data={factures}
      onRowSelect={(id) => setSelectedId(id)}
    />
  );
};

export default PageFacture;
