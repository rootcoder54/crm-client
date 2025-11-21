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
  }, [requete.id]);

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
        <Button asChild variant={"destructive"}>
          <Link href={`/requete/delete/${requete.id}`}>
            <Trash2 />
            Supprimer
          </Link>
        </Button>
      </HeaderPage>
      <div className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2 text-lg">
            <FileText />
            <span>Requête detail</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl lg:text-3xl">
              Sujet: {requete.sujet}
            </h2>
          </div>
          <hr />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {requete.sujet && (
              <div className="flex flex-row items-center space-x-2">
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Titre :
                </p>
                <p className="text-sm">{requete.sujet}</p>
              </div>
            )}
            {requete.description && (
              <div className="flex flex-row items-center space-x-25">
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Description :
                </p>
                <p className="text-sm">{requete.description}</p>
              </div>
            )}
            {requete.type && (
              <div className="flex flex-row items-center space-x-2">
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Type :
                </p>
                <p className="text-sm">{requete.type.toUpperCase()}</p>
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
            {requete.logiciel && (
              <div className="flex flex-row items-center space-x-2">
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Logiciel :
                </p>
                <p className="text-sm">{requete.logiciel}</p>
              </div>
            )}
            {requete.demandeur && (
              <div className="flex flex-row items-center space-x-2">
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Demandeur :
                </p>
                <p className="text-sm">{requete.demandeur}</p>
              </div>
            )}
            <div className="flex flex-row items-center space-x-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Technicien :
              </p>
              <p className="text-sm">
                {requete.technicien ? requete.technicien : "Non assigné"}
              </p>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Etat :
              </p>
              <p className="text-sm">
                {requete.etat ? requete.etat : "En Cours"}
              </p>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Date de création :
              </p>
              <p className="text-sm">
                {requete.dateDebut
                  ? new Date(requete.dateDebut).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Date de clôture :
              </p>
              <p className="text-sm">
                {requete.dateCloture
                  ? new Date(requete.dateCloture).toLocaleDateString()
                  : "Non clôturée"}
              </p>
            </div>
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
