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
    <DataTable
      chemins={[
        { title: "Licences", url: "/admin/licence" },
        { title: "Listes", url: "#" }
      ]}
      titre="Liste des licences"
      action={[
        {
          label: "Nouvelle licence",
          icon: <Plus />,
          url: "/admin/licence/add",
          variantbtn: "secondary"
        }
      ]}
      selectAction={[
        {
          label: "Details",
          icon: <SquarePen />,
          url: `/admin/licence/detail/`,
          variantbtn: "outline"
        },
        {
          label: "Supprimer",
          icon: <Trash2 />,
          url: `/admin/licence/delete/`,
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
  );
};

export default LicencePage;
