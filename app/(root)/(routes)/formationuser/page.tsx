import { DataTable } from "@/components/datatables";
import { Plus, SquarePen, Trash2 } from "lucide-react";

const PageFormation = () => {
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
            icon: "databases",
            title: "Aucune formation enregistrée",
            description:
              "Ajoutez une formation pour retrouver et suivre les informations de vos formations.",
            action: { label: "Ajouter une formation", href: "#" }
          }}
          chemins={[
            { title: "Formations", url: "/formation" },
            { title: "Listes", url: "#" }
          ]}
          titre="Liste des formations"
          action={[
            {
              label: "Nouvelle formation",
              icon: <Plus />,
              url: "#",
              variantbtn: "secondary"
            }
          ]}
          selectAction={[
            {
              label: "Details",
              icon: <SquarePen />,
              url: `/formation/detail/`,
              variantbtn: "outline"
            },
            {
              label: "Supprimer",
              icon: <Trash2 />,
              url: `/formation/delete/`,
              variantbtn: "danger"
            }
          ]}
          data={data || []}
          hideList={["id"]}
          notData="Aucune formation trouvée"
          //exportLien="/api/export/client"
          exportName="liste_formations"
          storageKey="formation-datatable"
        />
      </div>
    </div>
  );
};

export default PageFormation;
