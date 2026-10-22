import { Contrat } from "@prisma/client";
import { DataTable } from "../datatables";
import { Plus } from "lucide-react";

const ContratClient = ({
  contrats,
  clientId,
}: {
  contrats: Contrat[];
  clientId: string;
}) => {
  return (
    <DataTable
      emptyState={{
        icon: "contracts",
        title: "Aucun contrat pour ce client",
        description:
          "Enregistrez un contrat pour centraliser les engagements et les informations de ce client.",
        action: {
          label: "Ajouter un contrat",
          href: `/client/contrat/${clientId}/add`,
        },
      }}
      action={[
        {
          label: "Nouveau Contrat",
          icon: <Plus />,
          url: `/client/contrat/${clientId}/add`,
          variantbtn: "secondary",
        },
      ]}
      chemins={[
        { title: "Clients", url: "/client" },
        { title: "Details", url: `/client/detail/${clientId}` },
        { title: "Contrats", url: "#" },
      ]}
      selectAction={[]}
      data={contrats}
      hideList={["clientId", "createdAt", "updatedAt"]}
      notData="Aucun contrat trouvé"
      storageKey="contrat-datatable"
    />
  );
};

export default ContratClient;
