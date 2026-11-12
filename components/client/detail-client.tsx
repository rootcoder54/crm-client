"use client";

import { Client, Requete } from "@prisma/client";
import HeaderPage from "../features/header-page";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  File,
  FileArchive,
  FileArchiveIcon,
  Phone,
  SquarePen,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { DataTable } from "@/components/datatables";

const DetailClient = ({
  client,
  requetes
}: {
  client: Client | null;
  requetes: Requete[];
}) => {
  if (!client) {
    return <div>Client not found</div>;
  }
  return (
    <div>
      <HeaderPage
        chemins={[
          { title: "Clients", url: "/client" },
          { title: client.nomClient, url: "#" }
        ]}
      >
        <Button variant={"gray"} asChild size="sm">
          <Link
            href={"/client/requete/" + client.id}
            className="dark:text-foreground"
          >
            <FileArchive />
            <span className="hidden sm:flex">Requêtes</span>
          </Link>
        </Button>
        <Button variant={"outline"} asChild size="sm">
          <Link
            href={"/client/contact/" + client.id}
            className="dark:text-foreground"
          >
            <Phone />
            <span className="hidden sm:flex">Contact</span>
          </Link>
        </Button>
        <Button variant={"default"} asChild size="sm">
          <Link href={"/client/edite/" + client.id}>
            <SquarePen />
            <span className="hidden sm:flex">Editer</span>
          </Link>
        </Button>
        <Button variant={"outline"} asChild size="sm">
          <Link
            href={"/client/base/" + client.id}
            className="dark:text-foreground"
          >
            <FileArchiveIcon />
            <span className="hidden sm:flex">Base</span>
          </Link>
        </Button>
        <Button variant={"destructive"} asChild size="sm">
          <Link
            href={"/client/delete/" + client.id}
            className="dark:text-foreground"
          >
            <Trash2 />
            <span className="hidden sm:flex">Supprimer</span>
          </Link>
        </Button>
        <Button variant={"blue"} asChild size="sm">
          <Link
            href={"/client/contrat/" + client.id}
            className="dark:text-foreground"
          >
            <File />
            <span className="hidden sm:flex">Contrat</span>
          </Link>
        </Button>
      </HeaderPage>
      <div className="my-4 p-5 rounded-lg border-2 space-y-2">
        <h1 className="text-2xl font-bold">{client.nomClient}</h1>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold dark:text-white">Adresse</span>{" "}
                  : {client.adresse || "Aucune adresse renseignée"}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold dark:text-white">Sigle</span> :{" "}
                  {client.sigle || "Aucun sigle renseigné"}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold dark:text-white">Numero</span>{" "}
                  : {client.numero || "Aucun numéro renseigné"}
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold dark:text-white">
                    Téléphone
                  </span>{" "}
                  : {client.telephone || "Aucun N° téléphone renseigné"}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold dark:text-white">
                    Activité
                  </span>{" "}
                  : {client.activite || "Aucune activité renseignée"}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold dark:text-white">
                    Date d&apos;achat
                  </span>{" "}
                  :{" "}
                  {client.dateInscription
                    ? format(client.dateInscription, "dd/MM/yyyy")
                    : "Aucune date d'achat renseignée"}
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold dark:text-white">
                    Date de derniere visite
                  </span>{" "}
                  :{" "}
                  {client.dateLastVisite
                    ? format(client.dateLastVisite, "dd/MM/yyyy")
                    : "Aucune visite"}
                </p>
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <section className="crm-panel crm-table-panel rounded-xl border" aria-label="Requêtes associées au client">
        <DataTable
          isHeader={false}
          titre="Requêtes associées"
          description="Consultez les demandes de ce client, filtrez les dates et imprimez les résultats."
          data={requetes.map((requete) => ({
            id: requete.id,
            sujet: requete.sujet ?? "Sans sujet",
            technicien: requete.technicien ?? "Non attribué",
            dateDebut: requete.dateDebut ? new Date(requete.dateDebut).toISOString() : null,
            logiciel: requete.logiciel ?? "—",
            etat: requete.dateCloture ? "Clôturée" : "En cours",
          }))}
          rowHref={(row) => `/requete/detail/${row.id}`}
          globalSearch
          searchId="sujet"
          searchPlaceholder="Rechercher un sujet, un technicien…"
          dateChose="dateDebut"
          dateChoseTitle="Date de la requête"
          storageKey={`client-${client.id}-requetes`}
          hideList={["id"]}
          columnStyles={{
            sujet: (value, row) => (
              <Link
                href={`/requete/detail/${row.id}`}
                className="font-medium text-primary hover:underline"
              >
                {String(value)}
              </Link>
            ),
            dateDebut: (value) =>
              value ? format(new Date(String(value)), "dd/MM/yyyy") : "Non renseignée",
            etat: (value) => (
              <span className={
                value === "Clôturée"
                  ? "inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
              }>
                {String(value)}
              </span>
            ),
          }}
          printConfig={{
            title: "Liste des requêtes du client",
            subtitle: [client.nomClient, client.sigle, client.numero].filter(Boolean).join(" — "),
            columns: [
              { key: "sujet", label: "Sujet" },
              { key: "technicien", label: "Technicien" },
              { key: "dateDebut", label: "Date de requête" },
              { key: "logiciel", label: "Logiciel" },
              { key: "etat", label: "État" },
            ],
          }}
          emptyState={{
            icon: "requests",
            title: "Aucune requête associée",
            description: "Les demandes enregistrées pour ce client apparaîtront ici.",
          }}
        />
      </section>
    </div>
  );
};

export default DetailClient;
