import { DataTable } from "@/components/datatables";
import { Plus, SquarePen, Trash2 } from "lucide-react";

const LicencePage = () => {
  const data: {
    id: string;
    client: string;
    description: string;
    dateExpiration: Date;
    etat: string;
  }[] = [];
  return (
    <div className="crm-workspace">
      <div className="crm-panel crm-table-panel">
        <DataTable
          emptyState={{
            icon: "licenses",
            title: "Aucune licence enregistrée",
            description:
              "Ajoutez une licence pour retrouver et suivre les informations de vos logiciels.",
            action: { label: "Ajouter une licence", href: "/licence/add" }
          }}
          chemins={[
            { title: "Licences", url: "/licence" },
            { title: "Listes", url: "#" }
          ]}
          titre="Liste des licences"
          action={[
            {
              label: "Nouvelle licence",
              icon: <Plus />,
              url: "/licence/add",
              variantbtn: "secondary"
            }
          ]}
          selectAction={[
            {
              label: "Details",
              icon: <SquarePen />,
              url: `/licence/detail/`,
              variantbtn: "outline"
            },
            {
              label: "Supprimer",
              icon: <Trash2 />,
              url: `/licence/delete/`,
              variantbtn: "danger"
            }
          ]}
          data={data || []}
          hideList={["id"]}
          notData="Aucun licence trouvé"
          //exportLien="/api/export/client"
          exportName="liste_clients"
          storageKey="licence-datatable"
        />
      </div>
    </div>
  );
};

export default LicencePage;
