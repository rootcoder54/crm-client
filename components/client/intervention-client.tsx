import { ItemIntervention } from "@prisma/client";
import { DataTable } from "../datatables";

const InterventionClient = ({
  items,
  clientId,
}: {
  items: ItemIntervention[];
  clientId?: string;
}) => {
  return (
    <DataTable
      emptyState={{
        icon: "interventions",
        title: "Aucune intervention pour ce client",
        description:
          "Les interventions réalisées pour ce client apparaîtront ici.",
      }}
      chemins={[
        { title: "Clients", url: "/client" },
        { title: "Details", url: `/client/detail/${clientId}` },
        { title: "Interventions", url: "#" },
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
