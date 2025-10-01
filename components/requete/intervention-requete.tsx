"use client";
import { Intervention, Requete } from "@prisma/client";
import { DataTable } from "../datatables";
import { Plus } from "lucide-react";
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
      selectAction={[]}
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
