"use client";
import { Intervention } from "@prisma/client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { Spinner } from "@/components/ui/spinner";
import { DataTable } from "@/components/datatables";

const PageIntervention = () => {
  const { data: interventions } = useQuery<Intervention[]>({
    queryKey: ["intervention"],
    queryFn: () => fetcher(`/api/intervention`)
  });

  if (!interventions) {
    return (
      <div className="h-24 flex items-center w-full justify-center text-center">
        <Spinner className="size-8" />
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
    />
  );
};

export default PageIntervention;
