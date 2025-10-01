"use client";
import { Intervention, Requete } from "@prisma/client";
import { DataTable } from "../datatables";
import { Plus, SquarePen, Trash } from "lucide-react";
import { useState } from "react";

const InterventionRequete = ({
  requete
}: {
  requete: Requete & { Intervention: Intervention[] };
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
          variantbtn: "blue"
        }
      ]}
      selectAction={[
        {
          label: "Editer",
          icon: <SquarePen />,
          url: `/requete/intervention/${requete.id}/edite/${selectedId}`,
          variantbtn: "outline"
        },
        {
          label: "Supprimer",
          icon: <Trash />,
          url: `/requete/intervention/${requete.id}/delete/${selectedId}`,
          variantbtn: "danger"
        }
      ]}
      data={requete.Intervention}
      hideList={[
        "createdAt",
        "updatedAt",
        "client",
        "observations",
        "creePar",
        "requeteId",
        "clientId",
        "dateCloture"
      ]}
      searchId="sujet"
      searchPlaceholder="Rechercher une intervention"
      onRowSelect={(id) => setSelectedId(id)}
    />
  );
};

export default InterventionRequete;
