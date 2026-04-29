"use client";

import { Requete } from "@prisma/client";
import HeaderPage from "../features/header-page";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  CalendarCheck2,
  FileText,
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

type Item = {
  id: string;
  description: string | null;
  date: string;
  debut: string;
  fin: string;
  interventionId: string | null;
};

const DetailRequete = ({ requete }: { requete: Requete }) => {
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

  return (
    <div>
      <HeaderPage
        chemins={[
          { title: "Requête", url: "/requete" },
          { title: "Detail", url: "/requete/detail/" + requete.id }
        ]}
      >
        {requete.etat !== "CLOTURER" && (
          <Button asChild>
            <Link href={`/requete/intervention/${requete.id}/add`}>
              <PlusCircle />
              Intervention
            </Link>
          </Button>
        )}
        {requete.etat !== "CLOTURER" && (
          <Button asChild variant={"outline"}>
            <Link href={`/requete/edite/${requete.id}`}>
              <SquarePen />
              Editer
            </Link>
          </Button>
        )}
        {requete.etat !== "CLOTURER" && (
          <Button asChild>
            <Link href={`/requete/cloture/${requete.id}`}>
              <CalendarCheck2 />
              Clôture
            </Link>
          </Button>
        )}
        <Button asChild variant={"danger"}>
          <Link href={`/requete/delete/${requete.id}`}>
            <Trash2 />
            Supprimer
          </Link>
        </Button>
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
                  {requete.demandeur} <span className="text-xl">@</span> {client}
                </p>
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 underline">
                  Technicien :{" "}
                  {requete.technicien ? requete.technicien : "Non assigné"}
                </p>
              </div>
            )}
            {requete.description ? (
              <div className="flex flex-col items-start space-y-3 lg:w-3/4 xl:w-3/5 min-h-[100px]">
                <p>{requete.description}</p>
              </div>
            ) : (
              <div className="flex flex-col items-start text-center space-y-3 lg:w-3/4 xl:w-3/5 min-h-[100px]">
                <p>Aucune description disponible</p>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl md:text-2xl lg:text-3xl">Interventions</h3>
              <Link
                target="_blank"
                href={"/imprime/intervention/" + interventionID}
              >
                <FileText />
              </Link>
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
