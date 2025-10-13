import { Base } from "@prisma/client";
import { DataTable } from "../datatables";
import { Plus } from "lucide-react";

const BaseClient = ({
  bases,
  clientId
}: {
  bases: Base[];
  clientId: string;
}) => {
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
      selectAction={[]}
      data={bases}
      hideList={["clientId"]}
      searchId="nom"
      searchPlaceholder="Rechercher nom"
      notData="Aucun contact trouvé"
    />
  );
};

export default BaseClient;
