"use client";

import { DataTable } from "@/components/datatables";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetcher } from "@/lib/fetcher";
import { Facture } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, ArchiveIcon, FileBox, MailCheckIcon, MoreHorizontalIcon, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { LoaderOne } from "@/components/ui/loader";
import { format } from "date-fns";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const PageFacture = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const {
    isError,
    isPending,
    data: factures
  } = useQuery<(Facture & { client: { nomClient: string } })[]>({
    queryKey: ["factures"],
    queryFn: () => fetcher(`/api/facture`)
  });
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
            <p>Une erreur est survenue lors du chargement des factures.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  const listes =
    factures?.map((f) => ({
      id: f.id,
      numero: f.numero,
      type: f.type,
      date: f.date,
      client: f.client?.nomClient || f.clientId,
      acquittee: f.acquittee,
      modeReglement: f.modeReglement,
      devise: f.devise
    })) || [];

  return (
    <div>
      <DataTable
        chemins={[
          { title: "Factures", url: "/facture" },
          { title: "Listes", url: "#" }
        ]}
        action={[
          <ButtonGroup key={"bouttongroupe"}>
            <Button variant="outline" asChild>
              <Link href={"/facture/add"} >
              <Plus />
                Nouvelle Facture
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" className="rounded-l-none" size="icon" aria-label="More Options"><MoreHorizontalIcon /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <MailCheckIcon />
                    Achat de logiciel
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArchiveIcon />
                    Mise à jour
                  </DropdownMenuItem>
                </DropdownMenuGroup>

              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        ]}
        selectAction={[
          {
            label: "Details",
            icon: <FileBox />,
            url: `/facture/details/${selectedId}`,
            variantbtn: "blue"
          },
          {
            label: "Supprimer",
            icon: <Trash />,
            url: `/facture/delete/${selectedId}`,
            variantbtn: "danger"
          }
        ]}
        columnStyles={{
          numero: (value, row) => (
            <Link
              href={`/facture/details/${row.id}`}
              className="font-medium hover:underline"
            >
              {row.numero && row.numero.length > 30 ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>{row.numero.slice(0, 30) + "..."}</span>
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
          date: (value) => format(new Date(value as string), "dd/MM/yyyy")
        }}
        data={listes || []}
        dateChose="date"
        dateChoseTitle="Filter par Date"
        searchId="numero"
        searchPlaceholder="Rechercher un sujet..."
        onRowSelect={(id) => setSelectedId(id)}
        storageKey="facture-datatable"
      />
    </div>
  );
};

export default PageFacture;
