"use client ";

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
import { Badge } from "../ui/badge";

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
      <div>
        <h2 className="text-xl font-bold mb-4">Requêtes associées</h2>
        {requetes.length === 0 ? (
          <p>Aucune requête associée à ce client.</p>
        ) : (
          <Table>
            <TableRow>
              <TableCell className="font-bold">Sujet</TableCell>
              <TableCell className="font-bold">Technicien</TableCell>
              <TableCell className="font-bold">Date de début</TableCell>
              <TableCell className="font-bold">Etat</TableCell>
            </TableRow>
            {requetes.map((requete) => (
              <TableRow key={requete.id}>
                <TableCell>
                  <Link
                    href={`/requete/detail/${requete.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {requete.sujet}
                  </Link>
                </TableCell>
                <TableCell>{requete.technicien}</TableCell>
                <TableCell>
                  {requete.dateDebut && format(requete.dateDebut, "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  {requete.dateCloture ? (
                    <Badge>Clôturée</Badge>
                  ) : (
                    <Badge
                      className="bg-yellow-500 text-black"
                      variant={"default"}
                    >
                      En cours
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
};

export default DetailClient;
