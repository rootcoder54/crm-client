import { Contrat } from "@prisma/client";
import { DataTable } from "../datatables";
import { Plus } from "lucide-react";

const ContratClient = ({
  contrats,
  clientId
}: {
  contrats: Contrat[];
  clientId: string;
}) => {
  return (
    <DataTable
      action={[
        {
          label: "Nouveau Contrat",
          icon: <Plus />,
          url: `/client/contrat/${clientId}/add`,
          variantbtn: "secondary"
        }
      ]}
      chemins={[
        { title: "Clients", url: "/client" },
        { title: "Details", url: `/client/detail/${clientId}` },
        { title: "Contrats", url: "#" }
      ]}
      selectAction={[]}
      data={contrats}
      hideList={["clientId", "createdAt", "updatedAt"]}
      notData="Aucun contrat trouvé"
    />
  );
};

export default ContratClient;
