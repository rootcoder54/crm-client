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
    />
  );
};

export default LicencePage;
