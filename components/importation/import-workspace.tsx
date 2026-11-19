"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { FileSpreadsheet, Upload, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ImportKind = "client" | "facture" | "requete";
type Report = {
  message?: string;
  lignesImportées?: number;
  lignesIgnorées?: number;
  detailsIgnorées?: { ligne: number; raison: string }[];
  autresErreurs?: number;
  colonnesManquantes?: string[];
};
const definitions: Record<
  ImportKind,
  { name: string; description: string; columns: string[] }
> = {
  client: {
    name: "Clients",
    description: "Importez les informations de vos clients",
    columns: [
      "nomClient",
      "sigle",
      "adresse",
      "telephone",
      "activite",
      "numero",
      "dateInscription",
    ],
  },
  facture: {
    name: "Factures",
    description:
      "Une ligne Excel par article ; répétez le numéro pour les articles d'une même facture",
    columns: [
      "numero",
      "clientNumero",
      "date",
      "libelle",
      "quantity",
      "unitPrice",
      "reference",
      "remise",
      "tva",
      "type",
      "devise",
      "modeReglement",
      "acquittee",
      "observation",
    ],
  },
  requete: {
    name: "Requêtes",
    description: "Une ligne Excel par requête client",
    columns: [
      "clientNumero",
      "sujet",
      "description",
      "type",
      "logiciel",
      "demandeur",
      "technicien",
      "dateDebut",
      "dateCloture",
      "etat",
      "observation",
      "status",
      "isTacheClient",
    ],
  },
};
const samples: Record<ImportKind, string[][]> = {
  client: [
    [
      "Société Exemple",
      "EX",
      "Bamako",
      "70000000",
      "Services",
      "CL-001",
      "2026-11-01",
    ],
  ],
  facture: [
    [
      "FAC-001",
      "CL-001",
      "2026-11-01",
      "Prestation exemple",
      "1",
      "10000",
      "PREST-01",
      "0",
      "18",
      "FACTURE",
      "CFA",
      "Espèce",
      "non",
      "",
    ],
  ],
  requete: [
    [
      "CL-001",
      "Installation de logiciel",
      "Installation sur poste",
      "Support",
      "RHPaie",
      "Client",
      "Technicien",
      "2026-11-01",
      "",
      "En cours",
      "",
      "submitted",
      "oui",
    ],
  ],
};
function escapeCsv(value: string) {
  return '"' + value.replaceAll('"', '""') + '"';
}
function downloadTemplate(kind: ImportKind) {
  // Excel opens UTF-8 CSV with the semicolon delimiter using a BOM.
  const content =
    "\uFEFF" +
    [definitions[kind].columns, ...samples[kind]]
      .map((row) => row.map(escapeCsv).join(";"))
      .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/csv;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "modele-" + kind + ".csv";
  anchor.click();
  URL.revokeObjectURL(url);
}
export function ImportWorkspace() {
  const [kind, setKind] = useState<ImportKind | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [working, setWorking] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const selectKind = (next: ImportKind) => {
    setKind(next);
    setFile(null);
    setReport(null);
  };
  const close = () => {
    if (!working) {
      setKind(null);
      setFile(null);
      setReport(null);
    }
  };
  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!kind || !file) {
      toast.warning("Sélectionnez un fichier Excel");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Le fichier dépasse 5 Mo");
      return;
    }
    setWorking(true);
    setReport(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/import/" + kind, {
        method: "POST",
        body: form,
      });
      const result: Report = await response.json();
      setReport(result);
      if (!response.ok) {
        toast.error(
          result.colonnesManquantes?.length
            ? "Colonnes manquantes : " + result.colonnesManquantes.join(", ")
            : result.message || "Importation impossible",
        );
        return;
      }
      const created = result.lignesImportées ?? 0;
      const ignored = result.lignesIgnorées ?? 0;
      if (created) toast.success(result.message || "Importation terminée");
      else toast.warning(result.message || "Aucune donnée importée");
      if (ignored)
        toast.warning(ignored + " ligne(s) ignorée(s). Consultez le rapport.");
      setFile(null);
      if (input.current) input.current.value = "";
    } catch {
      toast.error("Erreur réseau. Vérifiez votre connexion puis réessayez.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {(["client", "facture", "requete"] as const).map((entry) => (
          <section
            key={entry}
            className="rounded-xl border bg-card p-5 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-3">
                <FileSpreadsheet className="size-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {definitions[entry].name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {definitions[entry].description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => selectKind(entry)}>
                <Upload className="mr-2 size-4" />
                Importer
              </Button>
              <Button variant="outline" onClick={() => downloadTemplate(entry)}>
                <Download className="mr-2 size-4" />
                Modèle CSV
              </Button>
            </div>
          </section>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Téléchargez un modèle, complétez-le puis enregistrez-le au format Excel
        (.xlsx ou .xls) avant l&apos;import. Les clients doivent déjà exister pour
        associer factures et requêtes. Utilisez leur numéro, leur identifiant ou
        leur nom exact si celui-ci est unique.
      </p>

      <AlertDialog
        open={kind !== null}
        onOpenChange={(opened) => {
          if (!opened) close();
        }}
      >
        <AlertDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Importer : {kind ? definitions[kind].name : ""}
            </AlertDialogTitle>
          </AlertDialogHeader>
          {kind && (
            <form className="space-y-4" onSubmit={upload}>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {definitions[kind].description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Colonnes : {definitions[kind].columns.join(", ")}
                </p>
                <div className="rounded-lg border border-dashed p-6 text-center space-y-3">
                  <FileSpreadsheet className="mx-auto size-9 text-muted-foreground" />
                  <Input
                    ref={input}
                    aria-label="Sélectionner un fichier Excel"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(event) => {
                      setFile(event.target.files?.[0] ?? null);
                      setReport(null);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Formats : .xlsx, .xls · Taille maximale : 5 Mo
                  </p>
                  {file && (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="truncate max-w-[260px]">
                        {file.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Retirer le fichier"
                        onClick={() => {
                          setFile(null);
                          if (input.current) input.current.value = "";
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {report && (
                <div
                  role="status"
                  className="space-y-2 rounded-lg border p-3 text-sm bg-green-300 text-green-900"
                >
                  <p className="font-semibold">{report.message}</p>
                  {!!report.colonnesManquantes?.length && (
                    <p>
                      Colonnes manquantes :{" "}
                      {report.colonnesManquantes.join(", ")}
                    </p>
                  )}
                  {report.lignesImportées !== undefined && (
                    <p>
                      Importées : {report.lignesImportées} · Ignorées :{" "}
                      {report.lignesIgnorées ?? 0}
                    </p>
                  )}
                  {!!report.detailsIgnorées?.length && (
                    <div className="max-h-44 overflow-y-auto">
                      <ul className="space-y-1">
                        {report.detailsIgnorées.map((issue, index) => (
                          <li key={index}>
                            Ligne {issue.ligne} : {issue.raison}
                          </li>
                        ))}
                      </ul>
                      {!!report.autresErreurs && (
                        <p>Et {report.autresErreurs} autres erreurs.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              <AlertDialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={close}
                  disabled={working}
                >
                  Fermer
                </Button>
                <Button type="submit" disabled={!file || working}>
                  {working ? "Importation en cours..." : "Lancer l'importation"}
                </Button>
              </AlertDialogFooter>
            </form>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
