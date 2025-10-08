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
      hideList={[
        "id"
      ]}
    />
  );
};

export default PageEmploye;
