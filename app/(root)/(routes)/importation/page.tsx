import HeaderPage from "@/components/features/header-page";
import { ImportClient } from "@/components/importation/import-client";

const PageImportation = () => {
  return (
    <div>
      <HeaderPage
        chemins={[{ title: "Importation", url: "/importation" }]}
      ></HeaderPage>
      <div className="flex flex-col items-start space-y-5 p-5">
        <h1 className="text-xl font-bold">Importation</h1>
        <ImportClient />
      </div>
    </div>
  );
};

export default PageImportation;
