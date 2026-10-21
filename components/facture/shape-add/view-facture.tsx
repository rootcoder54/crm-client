import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatAmount } from "@/lib/crm-metrics";
import Image from "next/image";

interface FactureViewProps {
  facture: {
    numero: string;
    date: string;
    client: string;
    clientId: string;
    type?: string;
    devise?: string;
    items: {
      reference: string;
      description: string;
      quantity: number;
      unitPrice: number;
      remise: number | undefined;
      tva: number | undefined;
      total: number | undefined;
    }[];
    totalHT: number;
    totalRemise: number;
    totalTVA: number;
    totalTTC: number;
  };
  open: boolean;
  close?: () => void;
}

export function FactureView({
  facture,
  open = false,
  close,
}: FactureViewProps) {
  const amount = (value: number | undefined) =>
    formatAmount(value, facture.devise ?? "CFA");
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) close?.();
      }}
    >
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-4xl max-h-[90vh] overflow-y-auto p-5 sm:p-8">
        <DialogHeader>
          <DialogTitle>
            Aperçu · {facture.type === "PROFORMA" ? "Proforma" : "Facture"}{" "}
            {facture.numero}
          </DialogTitle>
          <DialogDescription>
            Vérifiez le client, les prestations et les montants avant
            l’enregistrement.
          </DialogDescription>
        </DialogHeader>
        <Image
          src="/factureheader.png"
          alt="Malisystem"
          width={1000}
          height={100}
          className="w-full h-auto mt-4"
        />
        <div className="grid sm:grid-cols-2 gap-5 my-5 text-sm">
          <div>
            <p className="text-muted-foreground">Facturé à</p>
            <p className="font-semibold text-lg">{facture.client}</p>
            <p>N° client : {facture.clientId}</p>
          </div>
          <div className="sm:text-right">
            <p className="font-semibold">
              {facture.type ?? "FACTURE"} · {facture.numero}
            </p>
            <p>Date : {facture.date}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted">
              <tr>
                {[
                  "Prestation",
                  "Qté",
                  "Prix HT",
                  "Remise",
                  "TVA",
                  "Total TTC",
                ].map((label) => (
                  <th className="p-3 whitespace-nowrap font-medium" key={label}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facture.items.map((item, i) => (
                <tr className="border-b" key={i}>
                  <td className="p-3 min-w-48">
                    <strong className="font-medium">{item.description}</strong>
                    <p className="text-xs text-muted-foreground">
                      {item.reference}
                    </p>
                  </td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3 whitespace-nowrap">
                    {amount(item.unitPrice)}
                  </td>
                  <td className="p-3">{item.remise ?? 0} %</td>
                  <td className="p-3">{item.tva ?? 0} %</td>
                  <td className="p-3 whitespace-nowrap font-medium">
                    {amount(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <dl className="sm:ml-auto sm:w-80 space-y-3 py-5 text-sm">
          {[
            ["Total HT brut", facture.totalHT],
            ["Remises", facture.totalRemise],
            ["TVA après remises", facture.totalTVA],
            ["Total TTC", facture.totalTTC],
          ].map(([label, value]) => (
            <div
              className="flex justify-between gap-4 last:border-t last:pt-4 last:text-lg last:font-semibold"
              key={label}
            >
              <dt>{label}</dt>
              <dd>{amount(Number(value))}</dd>
            </div>
          ))}
        </dl>
        <p className="text-xs text-muted-foreground border-t pt-4 text-center">
          Malisystem · Lafiabougou, Bamako, Mali · (+223) 76 47 51 89 / 20 29 89
          61 · email@malisystem.com
        </p>
      </DialogContent>
    </Dialog>
  );
}
