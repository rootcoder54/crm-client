"use client ";

import { Client } from "@prisma/client";
import HeaderPage from "../features/header-page";
import { Button } from "../ui/button";
import Link from "next/link";
import { File, FileArchive, Phone, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Mode } from "../features/theme";

const DetailClient = ({ client }: { client: Client | null }) => {
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
        <Mode />
      </HeaderPage>
      <div className="my-4 p-5 rounded-lg border-2 space-y-2">
        <h1 className="text-2xl font-bold">{client.nomClient}</h1>
        {client.adresse && (
          <>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold dark:text-white">Adresse</span> :{" "}
              {client.adresse}
            </p>
            <hr />
          </>
        )}
        {client.sigle && (
          <>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold dark:text-white">Sigle</span> :{" "}
              {client.sigle}
            </p>
            <hr />
          </>
        )}
        {client.numero && (
          <>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold dark:text-white">Numero</span> :{" "}
              {client.numero}
            </p>
            <hr />
          </>
        )}
        {client.telephone && (
          <>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold dark:text-white">Téléphone</span> :{" "}
              {client.telephone}
            </p>
            <hr />
          </>
        )}
        {client.activite && (
          <>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold dark:text-white">Activité</span> :{" "}
              {client.activite}
            </p>
            <hr />
          </>
        )}
        {client.dateInscription && (
          <>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold dark:text-white">
                Date d&apos;achat
              </span>{" "}
              : {format(client.dateInscription, "dd/MM/yyyy")}
            </p>
            <hr />
          </>
        )}
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold dark:text-white">
            Date de derniere visite
          </span>{" "}
          :{" "}
          {client.dateLastVisite
            ? format(client.dateLastVisite, "dd/MM/yyyy")
            : "Aucune visite"}
        </p>
        <hr />
      </div>
    </div>
  );
};

export default DetailClient;
