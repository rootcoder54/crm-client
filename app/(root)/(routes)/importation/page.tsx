import HeaderPage from "@/components/features/header-page";
import { ImportWorkspace } from "@/components/importation/import-workspace";

export default function PageImportation() {
  return (
    <div className="crm-workspace">
      <HeaderPage chemins={[{ title: "Importation", url: "/importation" }]} />
      <main className="p-5 space-y-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Importation des données</h1>
          <p className="text-muted-foreground">
            Importez vos clients, factures et requêtes à partir de fichiers Excel.
          </p>
        </div>
        <ImportWorkspace />
      </main>
    </div>
  );
}
