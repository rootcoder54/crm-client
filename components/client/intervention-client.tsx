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
        { title: "Clients", url: "/admin/client" },
        { title: "Details", url: `/admin/client/detail/${clientId}` },
        { title: "Interventions", url: "#" }
      ]}
      data={items}
      hideList={["interventionId"]}
      searchId="nomClient"
      searchPlaceholder="Rechercher une nom de client"
      notData="Aucun client trouvé"
      storageKey="interve-datatable"
    />
  );
};

export default InterventionClient;
