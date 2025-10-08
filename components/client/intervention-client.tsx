import { ItemIntervention } from "@prisma/client";
import { DataTable } from "../datatables";

const InterventionClient = ({
  items,
  clientId
}: {
  items: ItemIntervention[];
  clientId?: string;
}) => {
  return (
    <DataTable
      chemins={[
        { title: "Clients", url: "/client" },
        { title: "Details", url: `/client/detail/${clientId}` },
        { title: "Interventions", url: "#" }
      ]}
      data={items}
      hideList={["interventionId"]}
      searchId="nomClient"
      searchPlaceholder="Rechercher une nom de client"
      notData="Aucun client trouvé"
    />
  );
};

export default InterventionClient;
