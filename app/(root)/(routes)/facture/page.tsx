"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Facture } from "@prisma/client";
import { FileText, Plus, Trash, Wallet, CheckCircle2, Eye } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/datatables";
import {
  FilterTabs,
  Metric,
  PageIntro,
  QueryState,
  StatusPill,
} from "@/components/crm/workspace";
import { fetcher } from "@/lib/fetcher";
import { formatAmount, formatDate, totalsByCurrency } from "@/lib/crm-metrics";

type Invoice = Facture & { client: { nomClient: string } | null };

export default function PageFacture() {
  const [selectedId, setSelectedId] = useState("");
  const [view, setView] = useState("all");
  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get("view");
    if (preset === "paid" || preset === "unpaid") setView(preset);
  }, []);
  const {
    data: factures,
    isPending,
    isError,
    refetch,
  } = useQuery<Invoice[]>({
    queryKey: ["factures"],
    queryFn: () => fetcher("/api/facture"),
  });
  if (isError || isPending)
    return <QueryState error={isError} retry={() => void refetch()} />;
  const paid = factures.filter((f) => f.acquittee);
  const unpaid = factures.filter((f) => !f.acquittee);
  const visible =
    view === "paid" ? paid : view === "unpaid" ? unpaid : factures;
  const rows = [...visible]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((f) => ({
      id: f.id,
      numero: f.numero,
      client: f.client?.nomClient || f.clientId,
      date: f.date,
      totalTTC: f.totalTTC,
      acquittee: f.acquittee,
      type: f.type,
      modeReglement: f.modeReglement,
      devise: f.devise,
    }));
  const unpaidTotals = totalsByCurrency(unpaid);

  return (
    <div className="crm-workspace crm-list-page">
      <PageIntro
        title="Une facturation plus lisible."
        description="Retrouvez vos factures, consultez les montants et identifiez les règlements à suivre."
      />
      <div className="crm-metrics crm-metrics-three">
        <Metric
          label="Factures enregistrées"
          value={factures.length}
          detail="Tous types de factures"
          icon={FileText}
        />
        <Metric
          label="Acquittées"
          value={paid.length}
          detail="Factures marquées comme réglées"
          icon={CheckCircle2}
          tone="green"
        />
        <Metric
          label="Non acquittées"
          value={unpaid.length}
          detail="Factures dont le règlement reste à suivre"
          icon={Wallet}
          tone="amber"
        />
      </div>
      <div className="crm-balance">
        <Wallet size={22} />
        <div>
          <strong>Montants TTC non acquittés</strong>
          <p>
            {unpaidTotals.length
              ? unpaidTotals.join(" · ")
              : unpaid.length
                ? "Montants non renseignés"
                : "Aucune facture à suivre"}
          </p>
          <small>
            Totaux par devise, sur les montants renseignés. Aucune conversion
            appliquée.
          </small>
        </div>
      </div>
      <FilterTabs
        label="Filtrer les factures"
        value={view}
        onChange={setView}
        items={[
          {
            value: "all",
            label: "Toutes les factures",
            count: factures.length,
          },
          { value: "unpaid", label: "Non acquittées", count: unpaid.length },
          { value: "paid", label: "Acquittées", count: paid.length },
        ]}
      />
      <div className="crm-panel crm-table-panel">
        <DataTable
          emptyState={{
            icon: "invoices",
            title: "Votre première facture vous attend",
            description:
              "Créez une facture pour retrouver ici votre historique de facturation et suivre les règlements.",
            action: { label: "Créer une facture", href: "/facture/add" },
          }}
          chemins={[{ title: "Factures", url: "/facture" }]}
          titre="Historique de facturation"
          headerEmpty={[
            { nom: "Numéro" },
            { nom: "Client" },
            { nom: "Date" },
            { nom: "Montant TTC" },
            { nom: "Règlement" },
          ]}
          action={[
            {
              label: "Nouvelle facture",
              icon: <Plus />,
              url: "/facture/add",
              variantbtn: "default",
            },
          ]}
          selectAction={[
            {
              label: "Consulter",
              icon: <Eye />,
              url: `/facture/details/${selectedId}`,
              variantbtn: "outline",
            },
            {
              label: "Supprimer",
              icon: <Trash />,
              url: `/facture/delete/${selectedId}`,
              variantbtn: "danger",
            },
          ]}
          data={rows}
          globalSearch
          rowHref={(row) => `/facture/details/${row.id}`}
          columnStyles={{
            numero: (value, row) => (
              <Link
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                href={`/facture/details/${row.id}`}
              >
                {value as string}
              </Link>
            ),
            date: (value) => formatDate(value as string | null),
            totalTTC: (value, row) => (
              <span className="font-semibold tabular-nums">
                {formatAmount(value as number | null, row.devise)}
              </span>
            ),
            acquittee: (value) => (
              <StatusPill done={!!value}>
                {value ? "Acquittée" : "Non acquittée"}
              </StatusPill>
            ),
          }}
          dateChose="date"
          dateChoseTitle="Date de facturation"
          searchId="numero"
          searchPlaceholder="Numéro, client, mode de règlement…"
          onRowSelect={setSelectedId}
          notData="Aucune facture ne correspond à votre recherche"
          storageKey="facture-datatable"
          exportName="liste_factures"
        />
      </div>
    </div>
  );
}
