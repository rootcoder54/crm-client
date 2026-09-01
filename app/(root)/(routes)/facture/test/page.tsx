import { FactureForm } from "@/components/facture/shape-add/form-facture";
import HeaderPage from "@/components/features/header-page";
import { Button } from "@/components/ui/button";
import { Ban, Printer, Save } from "lucide-react";

export default function TestPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <HeaderPage
        chemins={[
          { title: "Facture", url: "/facture" },
          { title: "Test", url: "#" }
        ]}
      >
        <Button>
          <Save />
          Enregistrer
        </Button>
        <Button variant={"outline"}>
          <Printer />
          Aperçu
        </Button>
        <Button variant={"danger"}>
          <Ban />
          Annuler
        </Button>
      </HeaderPage>

      <div className="">
        <FactureForm />
      </div>
    </div>
  );
}
