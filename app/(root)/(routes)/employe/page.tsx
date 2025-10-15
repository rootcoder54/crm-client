"use client";

import { DataTable } from "@/components/datatables";
import { employes } from "@/constante/employe";

const PageEmploye = () => {
  
  return (
    <DataTable
      chemins={[
        { title: "Employés", url: "/employe" },
        { title: "Listes", url: "#" }
      ]}
      action={[]}
      selectAction={[]}
      data={employes}
      searchId="nom"
      searchPlaceholder="Rechercher un nom d'employé"
      notData="Aucun employé trouvé"
      hideList={[
        "id"
      ]}
    />
  );
};

export default PageEmploye;
