"use client";

import { DataTable } from "@/components/datatables";
import { employes } from "@/constante/employe";

const PageEmploye = () => {
  return (
    <DataTable
      emptyState={{
        icon: "employees",
        title: "Aucun employé enregistré",
        description:
          "Les employés enregistrés apparaîtront ici pour faciliter le suivi de votre équipe.",
      }}
      chemins={[
        { title: "Employés", url: "/employe" },
        { title: "Listes", url: "#" },
      ]}
      titre="Employes"
      action={[]}
      selectAction={[]}
      data={employes}
      searchId="nom"
      searchPlaceholder="Rechercher un nom d'employé..."
      notData="Aucun employé trouvé"
      hideList={["id"]}
      exportName="liste_employes"
      storageKey="employe-datatable"
    />
  );
};

export default PageEmploye;
