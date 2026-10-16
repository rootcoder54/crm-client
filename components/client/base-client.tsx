"use client";
import { Base } from "@prisma/client";
import { DataTable } from "../datatables";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const BaseClient = ({
  bases,
  clientId
}: {
  bases: Base[];
  clientId: string;
}) => {
  const [selectedId, setSelectedId] = useState<string>("");

  return (
    <DataTable
      action={[
        {
          label: "Nouvelle Base",
          icon: <Plus />,
          url: `/admin/client/base/${clientId}/add`,
          variantbtn: "secondary"
        }
      ]}
      chemins={[
        { title: "Clients", url: "/admin/client" },
        { title: "Details", url: `/admin/client/detail/${clientId}` },
        { title: "Bases", url: "#" }
      ]}
      selectAction={[
        {
          label: "Supprimer",
          icon: <Trash2 />,
          url: `/admin/client/base/${clientId}/delete/${selectedId}`,
          variantbtn: "danger"
        }
      ]}
      data={bases}
      hideList={[
        "clientId",
        "createdAt",
        "updatedAt",
        "commentaire",
        "chemin",
        "date"
      ]}
      notData="Aucun Base trouvé"
      onRowSelect={(id) => setSelectedId(id)}
      storageKey="base-datatable"
    />
  );
};

export default BaseClient;
