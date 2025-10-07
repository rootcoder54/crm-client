import { ItemIntervention } from "@prisma/client";
import { DataTable } from "../datatables";

const InterventionClient = ({
  items
}: {
  items: ItemIntervention[];
}) => {
  return (
    <DataTable
      chemins={[
        { title: "Clients", url: "/client" },
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
