"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { Client, Facture, Requete } from "@prisma/client";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
  Users,
  Wallet,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import HeaderPage from "@/components/features/header-page";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  Metric,
  PageIntro,
  QueryState,
  StatusPill,
} from "@/components/crm/workspace";
import { fetcher } from "@/lib/fetcher";
import {
  formatAmount,
  formatDate,
  isUnassigned,
  totalsByCurrency,
} from "@/lib/crm-metrics";

type RequestRow = Requete & { client: string };
type InvoiceRow = Facture & { client: { nomClient: string } | null };

export default function Home() {
  const { data: session } = useSession();
  const clients = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => fetcher("/api/client"),
  });
  const requests = useQuery<RequestRow[]>({
    queryKey: ["requete"],
    queryFn: () => fetcher("/api/requete"),
  });
  const invoices = useQuery<InvoiceRow[]>({
    queryKey: ["factures"],
    queryFn: () => fetcher("/api/facture"),
  });
  const refresh = () => {
    void clients.refetch();
    void requests.refetch();
    void invoices.refetch();
  };
  const error = clients.isError || requests.isError || invoices.isError;
  const loading = clients.isPending || requests.isPending || invoices.isPending;
  const open = (requests.data ?? []).filter((row) => !row.dateCloture);
  const unassigned = open.filter((row) => isUnassigned(row.technicien));
  const unpaid = (invoices.data ?? []).filter((row) => !row.acquittee);
  const closed = (requests.data?.length ?? 0) - open.length;
  const rate = requests.data?.length
    ? Math.round((closed / requests.data.length) * 100)
    : 0;
  const oldest = [...open]
    .sort(
      (a, b) =>
        new Date(a.dateDebut ?? a.createdAt).getTime() -
        new Date(b.dateDebut ?? b.createdAt).getTime(),
    )
    .slice(0, 5);
  const latestInvoices = [...(invoices.data ?? [])]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  return (
    <div className="crm-workspace">
      <HeaderPage chemins={[{ title: "Vue d’ensemble", url: "/" }]}>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Actualiser le tableau de bord"
          onClick={refresh}
          disabled={
            clients.isFetching || requests.isFetching || invoices.isFetching
          }
        >
          <RefreshCw size={18} />
        </Button>
      </HeaderPage>
      <div className="crm-page-content">
        <PageIntro
          title={`Bonjour${session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}`}
          description="Vos clients, vos demandes et votre facturation. L’essentiel, au même endroit."
        >
          <Button asChild>
            <Link href="/requete/add">
              <Plus size={18} />
              Nouvelle requête
            </Link>
          </Button>
        </PageIntro>
        {error || loading ? (
          <QueryState error={error} retry={refresh} />
        ) : (
          <>
            <div className="crm-metrics">
              <Metric
                label="Clients accompagnés"
                value={clients.data?.length ?? 0}
                detail="Votre portefeuille Malisystem"
                icon={Users}
                href="/client"
              />
              <Metric
                label="Requêtes en cours"
                value={open.length}
                detail={`${unassigned.length} sans technicien attribué`}
                icon={Clock3}
                tone="amber"
                href="/requete"
              />
              <Metric
                label="Requêtes clôturées"
                value={closed}
                detail={`${rate} % des demandes enregistrées`}
                icon={CheckCircle2}
                tone="green"
                href="/requete"
              />
              <Metric
                label="Factures non acquittées"
                value={unpaid.length}
                detail="Consulter les montants à suivre"
                icon={Wallet}
                tone="violet"
                href="/facture?view=unpaid"
              />
            </div>
            <div className="crm-dashboard-grid">
              <section className="crm-panel">
                <div className="crm-panel-heading">
                  <div>
                    <p className="crm-eyebrow">SUIVI CLIENT</p>
                    <h2>Les demandes à traiter</h2>
                    <p>Les plus anciennes demandes encore ouvertes.</p>
                  </div>
                  <Link href="/requete" className="crm-text-link">
                    Tout voir <ArrowUpRight size={16} />
                  </Link>
                </div>
                {oldest.length ? (
                  <div className="crm-request-list">
                    {oldest.map((row) => (
                      <Link
                        key={row.id}
                        href={`/requete/detail/${row.id}`}
                        className="crm-request-row"
                      >
                        <span className="crm-avatar">
                          {(row.client || "M").slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3>{row.sujet || "Sans sujet"}</h3>
                          <p>
                            {row.client} ·{" "}
                            {row.logiciel || "Logiciel non précisé"}
                          </p>
                          <span className="crm-request-meta">
                            {isUnassigned(row.technicien)
                              ? "À attribuer"
                              : row.technicien}{" "}
                            · {formatDate(row.dateDebut)}
                          </span>
                        </div>
                        <ArrowUpRight
                          size={18}
                          className="shrink-0 text-muted-foreground"
                        />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Aucune demande en attente"
                    description="Les nouvelles requêtes apparaîtront ici."
                    href="/requete/add"
                    action="Enregistrer une requête"
                  />
                )}
              </section>
              <section className="crm-focus-panel">
                <span className="crm-eyebrow">VOTRE PROCHAINE ACTION</span>
                <h2>Un suivi qui fait la différence.</h2>
                <p>
                  Gardez une vue claire sur les demandes à attribuer et les
                  factures à suivre.
                </p>
                <Link href="/requete" className="crm-focus-item">
                  <Users size={20} />
                  <span>
                    <strong>
                      {unassigned.length} demande
                      {unassigned.length > 1 ? "s" : ""}
                    </strong>
                    <small>À attribuer à un technicien</small>
                  </span>
                  <ArrowRight size={18} />
                </Link>
                <Link href="/facture?view=unpaid" className="crm-focus-item">
                  <Wallet size={20} />
                  <span>
                    <strong>
                      {unpaid.length} facture{unpaid.length > 1 ? "s" : ""}
                    </strong>
                    <small>Non acquittées</small>
                  </span>
                  <ArrowRight size={18} />
                </Link>
                <div className="crm-focus-total">
                  <span>Montants TTC non acquittés</span>
                  {totalsByCurrency(unpaid).map((total) => (
                    <strong key={total}>{total}</strong>
                  ))}
                  {!totalsByCurrency(unpaid).length && (
                    <strong>
                      {unpaid.length
                        ? "Montants non renseignés"
                        : "Aucune facture à suivre"}
                    </strong>
                  )}
                  <small>
                    Totaux séparés par devise · montants renseignés uniquement.
                  </small>
                </div>
              </section>
            </div>
            <section className="crm-panel">
              <div className="crm-panel-heading">
                <div>
                  <p className="crm-eyebrow">FACTURATION</p>
                  <h2>Les dernières factures</h2>
                </div>
                <Link href="/facture" className="crm-text-link">
                  Toutes les factures <ArrowUpRight size={16} />
                </Link>
              </div>
              {latestInvoices.length ? (
                <div className="overflow-x-auto">
                  <table className="crm-simple-table">
                    <thead>
                      <tr>
                        <th>Facture / client</th>
                        <th>Date</th>
                        <th>Montant TTC</th>
                        <th>Règlement</th>
                        <th>
                          <span className="sr-only">Consulter</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestInvoices.map((row) => (
                        <tr key={row.id}>
                          <td>
                            <Link
                              href={`/facture/details/${row.id}`}
                              className="font-semibold hover:underline"
                            >
                              {row.numero}
                            </Link>
                            <p className="text-muted-foreground">
                              {row.client?.nomClient || "Client"}
                            </p>
                          </td>
                          <td>{formatDate(row.date)}</td>
                          <td className="font-semibold">
                            {formatAmount(row.totalTTC, row.devise)}
                          </td>
                          <td>
                            <StatusPill done={!!row.acquittee}>
                              {row.acquittee ? "Acquittée" : "Non acquittée"}
                            </StatusPill>
                          </td>
                          <td>
                            <Link
                              href={`/facture/details/${row.id}`}
                              aria-label={`Ouvrir la facture ${row.numero}`}
                            >
                              <ArrowUpRight size={18} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  title="Votre facturation commence ici"
                  description="Créez votre première facture pour un client Malisystem."
                  href="/facture/add"
                  action="Créer une facture"
                />
              )}
            </section>
            <div className="crm-shortcuts">
              {[
                {
                  href: "/client/add",
                  title: "Ajouter un client",
                  description: "Développez votre portefeuille",
                  icon: Users,
                },
                {
                  href: "/facture/add",
                  title: "Créer une facture",
                  description: "Préparez votre prochaine facturation",
                  icon: FileText,
                },
                {
                  href: "/draft",
                  title: "Reprendre un brouillon",
                  description: "Retrouvez vos demandes en préparation",
                  icon: Clock3,
                },
              ].map(({ href, title, description, icon: Icon }) => (
                <Link key={href} href={href}>
                  <Icon size={22} />
                  <span>
                    <strong>{title}</strong>
                    <small>{description}</small>
                  </span>
                  <ArrowUpRight size={18} />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
