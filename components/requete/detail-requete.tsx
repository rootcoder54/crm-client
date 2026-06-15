"use client";

import { Requete, UserRole } from "@prisma/client";
import HeaderPage from "../features/header-page";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  CalendarCheck2,
  FileText,
  Menu,
  PlusCircle,
  SquarePen,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { getItemsByRequete } from "@/services/itemIntervention.service";
import { DataTable } from "../datatables";
import { LoaderOne } from "../ui/loader";
import { format } from "date-fns";
import { getClientById } from "@/services/client.service";
import { Badge } from "../ui/badge";
import Writor from "../features/Writor";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Item = {
  id: string;
  description: string | null;
  date: string;
  debut: string;
  fin: string;
  interventionId: string | null;
};

const DetailRequete = ({ requete }: { requete: Requete }) => {
  const { data: session } = useSession();
  const [deleteControle, setDeleteControle] = useState<boolean>(false);
  const [clotureControle, setClotureControle] = useState<boolean>(false);
  const [editeControle, setEditeControle] = useState<boolean>(false);
  const [interventionControle, setInterventionControle] =
    useState<boolean>(false);
  const [items, setitems] = useState<Item[]>();
  const [client, setClient] = useState<string>();
  const [selectedId, setSelectedId] = useState<string>("");
  const [interventionID, setInterventionID] = useState<string>("");

  useEffect(() => {
    getItemsByRequete(requete.id).then((data) => {
      const listes = data?.map((item) => ({
        ...item,
        date: format(item.date, "dd/MM/yyyy")
      }));
      setInterventionID(listes[0]?.interventionId || "");
      setitems(listes);
    });
    if (requete.clientId) {
      getClientById(requete.clientId).then((data) => {
        setClient(data?.nomClient);
      });
    }
  }, [requete.id, requete.clientId]);

  const { data: roles } = useQuery<UserRole[]>({
    queryKey: ["role", session?.user?.id, "requete_delete"],
    queryFn: () => fetcher(`/api/role/${session?.user?.id}/requete_delete`)
  });

  const { data: rolesC } = useQuery<UserRole[]>({
    queryKey: ["role", session?.user?.id, "requete_cloture"],
    queryFn: () => fetcher(`/api/role/${session?.user?.id}/requete_cloture`)
  });

  const { data: rolesE } = useQuery<UserRole[]>({
    queryKey: ["role", session?.user?.id, "requete_edite"],
    queryFn: () => fetcher(`/api/role/${session?.user?.id}/requete_edite`)
  });

  const { data: rolesI } = useQuery<UserRole[]>({
    queryKey: ["role", session?.user?.id, "requete_intervention"],
    queryFn: () =>
      fetcher(`/api/role/${session?.user?.id}/requete_intervention`)
  });

  useEffect(() => {
    if (roles && roles.length > 0) {
      const hasDeleteRole = roles.some(
        (role) => role.name === "requete_delete" && role.accessLevel === 0
      );
      setDeleteControle(hasDeleteRole);
    }
  }, [roles]);

  useEffect(() => {
    if (rolesC && rolesC.length > 0) {
      const hasClotureRole = rolesC.some(
        (role) => role.name === "requete_cloture" && role.accessLevel === 0
      );
      setClotureControle(hasClotureRole);
    }
  }, [rolesC]);

  useEffect(() => {
    if (rolesE && rolesE.length > 0) {
      const hasEditeRole = rolesE.some(
        (role) => role.name === "requete_edite" && role.accessLevel === 0
      );
      setEditeControle(hasEditeRole);
    }
  }, [rolesE]);

  useEffect(() => {
    if (rolesI && rolesI.length > 0) {
      const hasInterventionRole = rolesI.some(
        (role) => role.name === "requete_intervention" && role.accessLevel === 0
      );
      setInterventionControle(hasInterventionRole);
    }
  }, [rolesI]);

  return (
    <div>
      <HeaderPage
        chemins={[
          { title: "Requête", url: "/requete" },
          { title: "Detail", url: "/requete/detail/" + requete.id }
        ]}
      >
        <div className="flex md:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-40">
              <div className="flex flex-col space-y-2 items-start">
                {requete.etat !== "CLOTURER" && (
                  <Button
                    asChild
                    variant={"ghost"}
                    hidden={interventionControle}
                  >
                    <Link href={`/requete/intervention/${requete.id}/add`}>
                      <PlusCircle />
                      Intervention
                    </Link>
                  </Button>
                )}
                {requete.etat !== "CLOTURER" && (
                  <Button asChild variant={"ghost"} hidden={editeControle}>
                    <Link href={`/requete/edite/${requete.id}`}>
                      <SquarePen />
                      Editer
                    </Link>
                  </Button>
                )}
                {requete.etat !== "CLOTURER" && (
                  <Button asChild variant={"ghost"} hidden={clotureControle}>
                    <Link href={`/requete/cloture/${requete.id}`}>
                      <CalendarCheck2 />
                      Clôture
                    </Link>
                  </Button>
                )}
                <Button asChild variant={"danger"} hidden={deleteControle}>
                  <Link href={`/requete/delete/${requete.id}`}>
                    <Trash2 />
                    Supprimer
                  </Link>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="hidden md:flex flex-row items-center space-x-2">
          {requete.etat !== "CLOTURER" && (
            <Button asChild hidden={interventionControle}>
              <Link href={`/requete/intervention/${requete.id}/add`}>
                <PlusCircle />
                Intervention
              </Link>
            </Button>
          )}
          {requete.etat !== "CLOTURER" && (
            <Button asChild variant={"outline"} hidden={editeControle}>
              <Link href={`/requete/edite/${requete.id}`}>
                <SquarePen />
                Editer
              </Link>
            </Button>
          )}
          {requete.etat !== "CLOTURER" && (
            <Button asChild hidden={clotureControle}>
              <Link href={`/requete/cloture/${requete.id}`}>
                <CalendarCheck2 />
                Clôture
              </Link>
            </Button>
          )}
          <Button asChild variant={"danger"} hidden={deleteControle}>
            <Link href={`/requete/delete/${requete.id}`}>
              <Trash2 />
              Supprimer
            </Link>
          </Button>
        </div>
      </HeaderPage>
      <div className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-0">
            {requete.type && (
              <div className="flex flex-row items-center space-x-2">
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Type :
                </p>
                <p className="text-sm">{requete.type.toUpperCase()}</p>
              </div>
            )}
            {requete.logiciel && (
              <div className="flex flex-row items-center space-x-2">
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Logiciel :
                </p>
                <p className="text-sm">{requete.logiciel}</p>
              </div>
            )}
            <div className="flex flex-row items-center space-x-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Observation :
              </p>
              <p className="text-sm">
                {requete.observation
                  ? requete.observation
                  : "Aucune observation"}
              </p>
            </div>
          </div>
          <hr />
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex flex-row items-center space-x-2">
              <FileText />
              <h2 className="text-xl md:text-xl lg:text-2xl">
                {requete.sujet}
              </h2>
              <Badge variant={"default"} className="bg-yellow-400 text-black">
                {requete.etat ? requete.etat : "En Cours"}
              </Badge>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex flex-row items-center space-x-2">
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Crée le :
                </p>
                <p className="text-sm">
                  {requete.dateDebut
                    ? new Date(requete.dateDebut).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              {requete.dateCloture && (
                <div className="flex flex-row items-center space-x-2">
                  <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Clôturé le :
                  </p>
                  <p className="text-sm">
                    {new Date(requete.dateCloture).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
          <hr />

          <div className="flex flex-col space-y-4">
            {client && (
              <div className="flex flex-col items-start space-x-3 gap-3">
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 underline">
                  Demandeur : {requete.demandeur}
                </p>
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 underline">
                  Client : {client}
                </p>
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 underline">
                  Technicien :{" "}
                  {requete.technicien ? requete.technicien : "Non assigné"}
                </p>
              </div>
            )}
            {requete.description ? (
              <div className="flex flex-col items-start space-y-3 min-h-[100px] bg-zinc-200 shadow dark:bg-zinc-600/50 rounded-md p-4">
                <Writor value={requete.description} />
              </div>
            ) : (
              <div className="flex flex-col items-start text-center space-y-3 min-h-[100px] bg-zinc-200 shadow dark:bg-zinc-600/50 rounded-md p-4">
                <p>Aucune description disponible</p>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl md:text-2xl lg:text-3xl">Interventions</h3>
              {items && items.length > 0 && (
                <Link
                  target="_blank"
                  href={"/imprime/intervention/" + interventionID}
                >
                  <FileText />
                </Link>
              )}
            </div>
            <hr />
            {items ? (
              <DataTable
                isHeader={false}
                data={items || []}
                notData="Pas d'intervention enregistré"
                hideList={["interventionId"]}
                onRowSelect={(id) => setSelectedId(id)}
                searchId="description"
                searchPlaceholder="Recherche description ..."
                selectAction={[
                  {
                    label: "Supprimer",
                    icon: <Trash2 />,
                    url: `/requete/intervention/${requete.id}/delete/${selectedId}`,
                    variantbtn: "danger"
                  }
                ]}
                storageKey="intervention-datatable"
              />
            ) : (
              <div className="flex items-center w-full justify-center text-center">
                <LoaderOne />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailRequete;
