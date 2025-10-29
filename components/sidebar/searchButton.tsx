"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { SidebarMenuButton } from "../ui/sidebar";
import { Search, X } from "lucide-react";
import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@/components/ui/empty";
import {
  Client,
  Contact,
  Contrat,
  Facture,
  Intervention,
  Requete
} from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { videos } from "@/constante/videoAstuce";

type ResultatType = {
  clients: Client[];
  contacts: Contact[];
  contrats: Contrat[];
  interventions: Intervention[];
  requetes: Requete[];
  factures: Facture[];
} | null;
export const SearchButton = () => {
  const [filter, setFilter] = useState("");
  const [results, setResults] = useState<ResultatType>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter(value);

    if (value.trim().length < 2) {
      setResults(null);
      return;
    }

    const res = await fetch(`/api/search?query=${encodeURIComponent(value)}`);
    const data = await res.json();
    setResults(data);
  };
  
  const filteredVideos = videos.filter(
    (video) =>
      video.nom.toLowerCase().includes(filter.toLowerCase()) ||
      video.description.toLowerCase().includes(filter.toLowerCase()) ||
      video.detail.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton className="cursor-pointer">
          <Search />
          Recherche
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-[825px]">
        <div className="flex items-center">
          <DialogTitle />
          <InputGroup>
            <InputGroupInput
              type="text"
              placeholder="recherche..."
              value={filter}
              onChange={handleSearch}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Button
                variant={"ghost"}
                size={"sm"}
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex flex-col">
          {!filter ? (
            <div className="flex justify-center items-center p-5 w-full">
              <span>Taper</span>
            </div>
          ) : (
            <ScrollArea className="h-72">
              <div className="flex p-5 w-full">
                {results && (
                  <div className="mt-4 space-y-4 w-full">
                    {results.clients.length !== 0 && (
                      <div className="w-full space-y-2">
                        <h3 className="font-semibold text-xl">Clients</h3>
                        <hr />
                        <div className="flex flex-col w-full space-y-3">
                          {results.clients.map((client: Client) => (
                            <Button
                              key={client.id}
                              variant={"ghost"}
                              className="justify-start w-full"
                              onClick={() => {
                                router.push(`/client/detail/${client.id}`);
                                setOpen(false);
                              }}
                            >
                              {client.nomClient}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    {results.requetes.length !== 0 && (
                      <div className="w-full space-y-2">
                        <h3 className="font-semibold text-xl">
                          Requetes Clients
                        </h3>
                        <hr />
                        <div className="flex flex-col w-full space-y-3">
                          {results.requetes.map((requete) => (
                            <Button
                              key={requete.id}
                              variant={"ghost"}
                              className="justify-start w-full"
                              onClick={() => {
                                router.push(
                                  `/requete/intervention/${requete.id}`
                                );
                                setOpen(false);
                              }}
                              type="button"
                            >
                              {requete.sujet}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    {filteredVideos.length !== 0 && (
                      <div className="w-full space-y-2">
                        <h3 className="font-semibold text-xl">
                          Astuces Videos
                        </h3>
                        <hr />
                        <div className="flex flex-col w-full space-y-3">
                          {filteredVideos.map((video) => (
                            <Button
                              key={video.id}
                              variant={"ghost"}
                              className="justify-start w-full"
                              onClick={() => {
                                router.push(`/support/astuce/${video.id}`);
                                setOpen(false);
                              }}
                              type="button"
                            >
                              {video.nom}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    {results.clients.length === 0 &&
                      results.requetes.length === 0 &&
                      filteredVideos.length === 0 && (
                        <Empty>
                          <EmptyHeader>
                            <EmptyTitle>Pas de Resultats Trouvé</EmptyTitle>
                            <EmptyDescription>
                              L&apos;information que vous cherchez n&apos;a pas
                              été trouvé. Essayez de reformuler !
                            </EmptyDescription>
                          </EmptyHeader>
                          <EmptyContent>
                            <EmptyDescription>
                              Besoin d&apos;aide ?{" "}
                              <Link href="/support">support</Link>
                            </EmptyDescription>
                          </EmptyContent>
                        </Empty>
                      )}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
