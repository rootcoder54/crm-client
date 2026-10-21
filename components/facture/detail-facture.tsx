"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Facture, ItemFacture, Client } from "@prisma/client";
import { Eye, FileText, Wallet } from "lucide-react";
import HeaderPage from "@/components/features/header-page";
import {
  Metric,
  PageIntro,
  QueryState,
  StatusPill,
} from "@/components/crm/workspace";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import { formatAmount, formatDate } from "@/lib/crm-metrics";
import { FactureView } from "./shape-add/view-facture";

export const DetailFacture = ({ idFacture }: { idFacture: string }) => {
  const [preview, setPreview] = useState(false);
  const {
    data: facture,
    isPending,
    isError,
    refetch,
  } = useQuery<
    Facture & { itemFactures: ItemFacture[]; client: Client | null }
  >({
    queryKey: ["facture", idFacture],
    queryFn: () => fetcher(`/api/facture/details/${idFacture}`),
  });
  if (isPending || isError || !facture)
    return (
      <QueryState
        error={isError || (!isPending && !facture)}
        retry={() => void refetch()}
      />
    );
  const amount = (value: number | null) => formatAmount(value, facture.devise);
  return (
    <div className="crm-workspace">
      <HeaderPage
        chemins={[
          { title: "Factures", url: "/facture" },
          { title: facture.numero, url: "#" },
        ]}
      >
        <Button variant="outline" onClick={() => setPreview(true)}>
          <Eye size={18} />
          Aperçu
        </Button>
      </HeaderPage>
      <div className="crm-page-content">
        <PageIntro
          eyebrow="FACTURATION · DÉTAIL"
          title={`Facture ${facture.numero}`}
          description={`${facture.client?.nomClient ?? "Client"} · Émise le ${formatDate(facture.date)}`}
        >
          <StatusPill done={!!facture.acquittee}>
            {facture.acquittee ? "Acquittée" : "Non acquittée"}
          </StatusPill>
        </PageIntro>
        <div className="crm-metrics crm-metrics-three">
          <Metric
            label="Total TTC"
            value={amount(facture.totalTTC)}
            detail={facture.type || "Facture"}
            icon={Wallet}
          />
          <Metric
            label="Prestations"
            value={facture.itemFactures.length}
            detail="Lignes enregistrées"
            icon={FileText}
            tone="violet"
          />
          <Metric
            label="Règlement"
            value={facture.modeReglement || "Non précisé"}
            detail={
              facture.acquittee ? "Facture acquittée" : "Règlement à suivre"
            }
            icon={Wallet}
            tone="amber"
          />
        </div>
        <section className="crm-panel">
          <div className="crm-panel-heading">
            <h2 className="text-xl font-semibold">Détail des prestations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="crm-simple-table">
              <thead>
                <tr>
                  {[
                    "Description",
                    "Quantité",
                    "Prix HT",
                    "Remise",
                    "TVA",
                    "Total TTC",
                  ].map((label) => (
                    <th key={label}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {facture.itemFactures.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong className="font-medium">{item.libelle}</strong>
                      <p>{item.reference}</p>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{amount(item.unitPrice)}</td>
                    <td>{item.remise ?? 0} %</td>
                    <td>{item.tva ?? 0} %</td>
                    <td>{amount(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="crm-panel crm-form-section">
          <div className="crm-form-grid">
            <div>
              <h2 className="text-lg font-semibold">Observations</h2>
              <p className="text-muted-foreground mt-3 whitespace-pre-wrap">
                {facture.observation || "Aucune observation."}
              </p>
            </div>
            <dl className="space-y-3 text-sm">
              {[
                ["Total HT brut", facture.totalHT],
                ["Remises", facture.remise],
                ["TVA", facture.totalTVA],
                ["Total TTC", facture.totalTTC],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="flex justify-between gap-4 last:border-t last:pt-4 last:font-semibold last:text-lg"
                >
                  <dt>{label}</dt>
                  <dd>{amount(value as number | null)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>
      <FactureView
        open={preview}
        close={() => setPreview(false)}
        facture={{
          numero: facture.numero,
          date: formatDate(facture.date),
          client: facture.client?.nomClient ?? "",
          clientId: facture.client?.numero ?? "",
          type: facture.type ?? "FACTURE",
          devise: facture.devise ?? "CFA",
          items: facture.itemFactures.map((item) => ({
            ...item,
            description: item.libelle,
            remise: item.remise ?? 0,
            tva: item.tva ?? 0,
          })),
          totalHT: facture.totalHT ?? 0,
          totalRemise: facture.remise ?? 0,
          totalTVA: facture.totalTVA ?? 0,
          totalTTC: facture.totalTTC ?? 0,
        }}
      />
    </div>
  );
};
