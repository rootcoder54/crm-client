"use client";
import { Requete, UserRole } from "@prisma/client";
import {
  AlertCircleIcon,
  FileBox,
  LayoutGrid,
  Plus,
  Trash
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/datatables";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LoaderOne } from "@/components/ui/loader";
import Link from "next/link";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";

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
    data: requetes
  } = useQuery<RequeteWithClient[]>({
    queryKey: ["requete"],
    queryFn: () => fetcher(`/api/requete`)
  });

  const { data: roles } = useQuery<UserRole[]>({
    queryKey: ["role", session?.user?.id, "requete_delete"],
    queryFn: () => fetcher(`/api/role/${session?.user?.id}/requete_delete`)
  });

  useEffect(() => {
    if (roles && roles.length > 0) {
      const hasDeleteRole = roles.some((role) => role.name === "requete_delete" && role.accessLevel === 0);
      setDeleteControle(hasDeleteRole);
    }
  }, [roles]);
  console.log("roles de l'utilisateur",deleteControle);

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

  return (
    <div className="flex-1 h-full">
      <DataTable
        chemins={[
          { title: "Requête", url: "/requete" },
          { title: "Listes", url: "#" }
        ]}
        titre="Liste des Requêtes"
        onDoubleClickLink={`/requete/detail/${selectedId}`}
        action={[
          {
            label: "Nouvelle Requête",
            icon: <Plus />,
            url: "/requete/add",
            variantbtn: "default"
          }
        ]}
        selectAction={[
          {
            label: "Details",
            icon: <FileBox />,
            url: `/requete/detail/${selectedId}`,
            variantbtn: "outline"
          },
          {
            label: "Supprimer",
            icon: <Trash />,
            url: `/requete/delete/${selectedId}`,
            variantbtn: "danger",
            hide: deleteControle,
          }
        ]}
        data={requetes}
        dateChose="dateDebut"
        dateChoseTitle="Filter par Date"
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
          date: (value) => format(new Date(value as string), "dd/MM/yyyy"),
          etat: (value) => (
            <Badge
              variant={"default"}
              className={cn(value !== "Cloturée" && "bg-yellow-400 text-black")}
            >
              {value as string}
            </Badge>
          ),
          type: (value) => <span className="uppercase">{value as string}</span>
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
          "type"
        ]}
        searchId="sujet"
        searchPlaceholder="Rechercher un sujet..."
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
                )
              },
              {
                label: "TimeSheet",
                value: "TimeSheet",
                icon: () => (
                  <Image src="/timesheet.png" alt="t" width={20} height={20} />
                )
              },
              {
                label: "RHData",
                value: "RHData",
                icon: () => (
                  <Image src="/rhdata.png" alt="d" width={20} height={20} />
                )
              },
              {
                label: "RHFacture",
                value: "RHFacture",
                icon: () => (
                  <Image src="/rhfacture.png" alt="f" width={20} height={20} />
                )
              }
            ]
          }
        ]}
        onRowSelect={(id) => setSelectedId(id)}
        exportName="liste_requetes"
        storageKey="requete-datatable"
      />
    </div>
  );
};

export default PageRequete;
