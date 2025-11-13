"use client";
import { Intervention } from "@prisma/client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { DataTable } from "@/components/datatables";
import { LoaderOne } from "@/components/ui/loader";

const PageIntervention = () => {
  const { data: interventions } = useQuery<Intervention[]>({
    queryKey: ["intervention"],
    queryFn: () => fetcher(`/api/intervention`)
  });

  if (!interventions) {
    return (
      <div className="min-h-screen flex items-center w-full justify-center text-center">
        <LoaderOne />
      </div>
    );
  }
  return (
    <DataTable
      chemins={[
        { title: "Interventions", url: "/intervention" },
        { title: "Listes", url: "#" }
      ]}
      action={[]}
      selectAction={[]}
      data={interventions}
      hideList={[
        "observations",
        "creePar",
        "afacturee",
        "clientId",
        "requeteId",
        "dateCloture",
        "createdAt",
        "updatedAt"
      ]}
      searchId="intervenant"
      searchPlaceholder="Recherche par intervenant..."
      notData="Aucune intervention trouvée"
      exportName="liste_intervantions"
    />
  );
};

export default PageIntervention;
