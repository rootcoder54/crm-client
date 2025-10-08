"use client ";

import { Client } from "@prisma/client";
import HeaderPage from "../features/header-page";
import { Button } from "../ui/button";
import Link from "next/link";
import { File, FileArchive, Phone } from "lucide-react";

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
            href={"/client/intervention/" + client.id}
            className="dark:text-foreground"
          >
            <FileArchive />
            <span className="hidden sm:flex">Interventions</span>
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
      Detail Client Page {client.nomClient}
    </div>
  );
};

export default DetailClient;
