"use client";
import { Intervention, ItemIntervention, Requete } from "@prisma/client";
import { DataTable } from "../datatables";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";

const InterventionRequete = ({
  requete,
  items
}: {
  requete: Requete & { Intervention: Intervention[] };
  items: ItemIntervention[];
}) => {
  const [selectedId, setSelectedId] = useState<string>("");
  console.log(selectedId);
  console.log(requete.Intervention);
  return (
    <DataTable
      chemins={[
        { title: "Requête", url: "/requete" },
        { title: "Interventions", url: "#" }
      ]}
      action={[
        {
          label: "Nouvelle Intervention",
          icon: <Plus />,
          url: `/requete/intervention/${requete.id}/add`,
          variantbtn: "blue",
          hide: requete.etat === "CLOTURER"
        }
      ]}
      selectAction={[
        {
          label: "Supprimer",
          icon: <Trash />,
          url: `/requete/intervention/${requete.id}/delete/${selectedId}`,
          variantbtn: "danger",
          hide: requete.etat === "CLOTURER"
        }
      ]}
      data={items}
      hideList={["interventionId"]}
      onRowSelect={(id) => setSelectedId(id)}
    />
  );
};

export default InterventionRequete;
