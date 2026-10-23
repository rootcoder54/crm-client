"use client";

import { Metric, PageIntro, FilterTabs } from "@/components/crm/workspace";
import { Users, Phone, Building2 } from "lucide-react";
import { DataTable } from "@/components/datatables";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderOne } from "@/components/ui/loader";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { fetcher } from "@/lib/fetcher";
import { Client } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircleIcon,
  FileChartPie,
  Plus,
  SquarePen,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import HeaderPage from "@/components/features/header-page";
import { Button } from "@/components/ui/button";

const ClientPage = () => {
  const [view, setView] = useState("all");
  const [selectedId, setSelectedId] = useState<string>("");
  const {
    isPending,
    isError,
    data: clients
  } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => fetcher(`/api/client`)
  });
  const dataFiltered = Array.from(
    new Map(
      (clients ?? []).map((client) => [
        client.activite || "N/A",
        {
          label: client.activite || "Pas d'activité",
          value: client.activite || "Pas d'activité"
        }
      ])
    ).values()
  );

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center w-full justify-center text-center">
        <LoaderOne />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="m-4">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle> Erreur de donnée </AlertTitle>
          <AlertDescription>
            <p>Une erreur est survenue lors du chargement des clients.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const missingPhone = clients.filter((client) => !client.telephone?.trim());
  const visibleClients = view === "missing-phone" ? missingPhone : clients;
  return (
    <div className="crm-workspace">
      <HeaderPage chemins={[{ title: "Clients", url: "/client" }]}>
        <Button
          variant="blue"
          asChild
          className="flex items-center gap-2 hover:bg-blue-600 dark:hover:bg-blue-500"
        >
          <Link href="/client/add" className="flex items-center gap-2">
            <Plus size={18} />
            Nouveau client
          </Link>
        </Button>
      </HeaderPage>
      <div className="crm-list-page">
        <PageIntro
          title="Vos clients, au cœur du suivi."
          description="Retrouvez les coordonnées, les requêtes et l’historique de chaque client Malisystem."
        />
        <div className="crm-metrics crm-metrics-three">
          <Metric
            label="Clients"
            value={clients.length}
            detail="Dans votre portefeuille"
            icon={Users}
          />
          <Metric
            label="Secteurs d’activité"
            value={
              new Set(clients.map((c) => c.activite?.trim()).filter(Boolean))
                .size
            }
            detail="Des entreprises de tous horizons"
            icon={Building2}
            tone="violet"
          />
          <Metric
            label="Coordonnées à compléter"
            value={missingPhone.length}
            detail="Clients sans numéro de téléphone"
            icon={Phone}
            tone="amber"
          />
        </div>
        <FilterTabs
          label="Filtrer les clients"
          value={view}
          onChange={setView}
          items={[
            { value: "all", label: "Tous les clients", count: clients.length },
            {
              value: "missing-phone",
              label: "Sans téléphone",
              count: missingPhone.length
            }
          ]}
        />
        <div className="crm-panel crm-table-panel">
          <DataTable
            emptyState={{
              icon: "clients",
              title: "Aucun client pour le moment",
              description:
                "Créez votre première fiche pour centraliser les coordonnées, les requêtes et les factures de vos clients.",
              action: { label: "Ajouter un client", href: "/client/add" }
            }}
            isHeader={false}
            titre="Répertoire clients"
            action={[
              {
                label: "Nouveau client",
                icon: <Plus />,
                url: "/client/add",
                variantbtn: "default"
              }
            ]}
            selectAction={[
              {
                label: "Details",
                icon: <SquarePen />,
                url: `/client/detail/${selectedId}`,
                variantbtn: "outline"
              },
              {
                label: "Supprimer",
                icon: <Trash2 />,
                url: `/client/delete/${selectedId}`,
                variantbtn: "danger"
              }
            ]}
            columnStyles={{
              nomClient: (value, row) => (
                <Link
                  href={`/client/detail/${row.id}`}
                  className="font-medium hover:underline"
                >
                  {row.nomClient && row.nomClient.length > 30 ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{row.nomClient.slice(0, 30) + "..."}</span>
                      </TooltipTrigger>
                      <TooltipContent className="w-[560px] p-4" side="bottom">
                        <p>{value as string}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span>{value as string}</span>
                  )}
                </Link>
              )
            }}
            data={visibleClients}
            globalSearch
            rowHref={(row) => `/client/detail/${row.id}`}
            hideList={[
              "createdAt",
              "updatedAt",
              "adresse",
              "sigle",
              "dateInscription",
              "dateNewVisite",
              "dateLastVisite",
              "requete"
            ]}
            popFilter={[
              {
                dataFilter: "activite",
                icon: <FileChartPie />,
                options: dataFiltered
              }
            ]}
            onDoubleClickLink={"/client/detail/" + selectedId}
            dateChose="dateLastVisite"
            dateChoseTitle="Dernière requête"
            searchId="nomClient"
            searchPlaceholder="Nom, téléphone, activité…"
            notData="Aucun client trouvé"
            onRowSelect={(id) => setSelectedId(id)}
            //exportLien="/api/export/client"
            exportName="liste_clients"
            storageKey="client-datatable"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
