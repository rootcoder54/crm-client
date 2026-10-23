"use client";
import { Metric, PageIntro, StatusPill } from "@/components/crm/workspace";
import { formatDate, isUnassigned } from "@/lib/crm-metrics";
import { Clock3, CheckCircle2, UserRound } from "lucide-react";
import { Requete, UserRole } from "@prisma/client";
import {
  AlertCircleIcon,
  FileBox,
  LayoutGrid,
  Plus,
  Trash,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/datatables";
import { useEffect, useState } from "react";
import { LoaderOne } from "@/components/ui/loader";
import Link from "next/link";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";
import HeaderPage from "@/components/features/header-page";
import { Button } from "@/components/ui/button";

interface RequeteWithClient extends Requete {
  [key: string]: unknown;
  client: string;
  date: Date | null;
  etat: string;
  numero: string;
}

const PageRequete = () => {
  const { data: session } = useSession();
  const [selectedId, setSelectedId] = useState<string>("");
  const [deleteControle, setDeleteControle] = useState<boolean>(false);

  const {
    isError,
    isPending,
    data: requetes,
  } = useQuery<RequeteWithClient[]>({
    queryKey: ["requete"],
    queryFn: () => fetcher(`/api/requete`),
  });

  const { data: roles } = useQuery<UserRole[]>({
    queryKey: ["role", session?.user?.id, "requete_delete"],
    enabled: !!session?.user?.id,
    queryFn: () => fetcher(`/api/role/${session?.user?.id}/requete_delete`),
  });

  useEffect(() => {
    if (roles && roles.length > 0) {
      const hasDeleteRole = roles.some(
        (role) => role.name === "requete_delete" && role.accessLevel === 0,
      );
      setDeleteControle(hasDeleteRole);
    }
  }, [roles]);

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
            <p>Une erreur est survenue lors du chargement des requêtes.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const open = requetes.filter((r) => !r.dateCloture);
  const closed = requetes.filter((r) => !!r.dateCloture);
  const unassigned = open.filter((r) => isUnassigned(r.technicien));
  return (
    <div className="crm-workspace">
      <HeaderPage chemins={[{ title: "Requêtes", url: "/requete" }]}>
        <Button
          variant="blue"
          asChild
          className="flex items-center gap-2 hover:bg-blue-600 dark:hover:bg-blue-500"
        >
          <Link href="/requete/add" className="flex items-center gap-2">
            <Plus size={18} />
            Nouvelle requête
          </Link>
        </Button>
      </HeaderPage>
      <div className="crm-list-page">
      <PageIntro
        title="Un service client bien suivi."
        description="Enregistrez les demandes, retrouvez les techniciens et suivez les interventions jusqu’à la clôture."
      />
      <div className="crm-metrics crm-metrics-three">
        <Metric
          label="En cours"
          value={open.length}
          detail="Demandes à prendre en charge"
          icon={Clock3}
          tone="amber"
        />
        <Metric
          label="Clôturées"
          value={closed.length}
          detail="Demandes traitées par l’équipe"
          icon={CheckCircle2}
          tone="green"
        />
        <Metric
          label="À attribuer"
          value={unassigned.length}
          detail="Demandes ouvertes sans technicien"
          icon={UserRound}
          tone="violet"
        />
      </div>
      <div className="crm-panel crm-table-panel mt-5">
        <DataTable
          emptyState={{
            icon: "requests",
            title: "Aucune requête pour le moment",
            description:
              "Enregistrez une demande client pour suivre son traitement et les interventions de votre équipe.",
            action: { label: "Créer une requête", href: "/requete/add" },
          }}
          isHeader={false}
          titre="Liste des Requêtes"
          onDoubleClickLink={`/requete/detail/${selectedId}`}
          action={[
            {
              label: "Nouvelle Requête",
              icon: <Plus />,
              url: "/requete/add",
              variantbtn: "default",
            },
          ]}
          selectAction={[
            {
              label: "Details",
              icon: <FileBox />,
              url: `/requete/detail/${selectedId}`,
              variantbtn: "outline",
            },
            {
              label: "Supprimer",
              icon: <Trash />,
              url: `/requete/delete/${selectedId}`,
              variantbtn: "danger",
              hide: deleteControle,
            },
          ]}
          data={requetes}
          globalSearch
          rowHref={(row) => `/requete/detail/${row.id}`}
          dateChose="dateDebut"
          dateChoseTitle="Date de début"
          columnStyles={{
            sujet: (value, row) => (
              <Link
                href={`/requete/detail/${row.id}`}
                className="font-medium hover:underline"
              >
                {row.sujet && row.sujet.length > 30 ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{row.sujet.slice(0, 30) + "..."}</span>
                    </TooltipTrigger>
                    <TooltipContent className="w-[560px] p-4" side="bottom">
                      <p>{value as string}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span>{value as string}</span>
                )}
              </Link>
            ),
            date: (value) => formatDate(value as string | null),
            etat: (_value, row) => (
              <StatusPill done={!!row.dateCloture}>
                {row.dateCloture ? "Clôturée" : "En cours"}
              </StatusPill>
            ),
            type: (value) => (
              <span className="uppercase">{value as string}</span>
            ),
          }}
          hideList={[
            "createdAt",
            "updatedAt",
            "dateCloture",
            "Intervention",
            "logiciel",
            "observation",
            "clientId",
            "dateDebut",
            "description",
            "isTacheClient",
            "status",
            "type",
          ]}
          searchId="sujet"
          searchPlaceholder="Sujet, client, technicien, logiciel…"
          popFilter={[
            {
              dataFilter: "logiciel",
              icon: <LayoutGrid />,
              options: [
                {
                  label: "RHPaie",
                  value: "RHPaie",
                  icon: () => (
                    <Image src="/rhpaie.png" alt="p" width={20} height={20} />
                  ),
                },
                {
                  label: "TimeSheet",
                  value: "TimeSheet",
                  icon: () => (
                    <Image
                      src="/timesheet.png"
                      alt="t"
                      width={20}
                      height={20}
                    />
                  ),
                },
                {
                  label: "RHData",
                  value: "RHData",
                  icon: () => (
                    <Image src="/rhdata.png" alt="d" width={20} height={20} />
                  ),
                },
                {
                  label: "RHFacture",
                  value: "RHFacture",
                  icon: () => (
                    <Image
                      src="/rhfacture.png"
                      alt="f"
                      width={20}
                      height={20}
                    />
                  ),
                },
              ],
            },
          ]}
          onRowSelect={(id) => setSelectedId(id)}
          exportName="liste_requetes"
          storageKey="requete-datatable"
        />
      </div>
      </div>
    </div>
  );
};

export default PageRequete;
