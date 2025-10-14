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
          url: `/client/base/${clientId}/add`,
          variantbtn: "secondary"
        }
      ]}
      chemins={[
        { title: "Clients", url: "/client" },
        { title: "Details", url: `/client/detail/${clientId}` },
        { title: "Bases", url: "#" }
      ]}
      selectAction={[
        {
          label: "Supprimer",
          icon: <Trash2 />,
          url: `/client/base/${clientId}/delete/${selectedId}`,
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
    />
  );
};

export default BaseClient;
