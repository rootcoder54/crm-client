"use client";

import HeaderPage from "@/components/features/header-page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { Requete } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function Home() {
  const { data: requetes } = useQuery<Requete[]>({
    queryKey: ["requete"],
    queryFn: () => fetcher(`/api/requete`)
  });

  return (
    <div>
      <HeaderPage chemins={[{ title: "Home", url: "/" }]}></HeaderPage>
      <div className="flex-1 h-full p-4">
        <h1 className="text-xl">Page d&apos;accueil</h1>
        <p>Bienvenue sur la page d&apos;accueil de notre application !</p>
        <hr className="my-5" />
        <h1 className="text-xl text-blue-500 font-bold">Requête en cours</h1>
        <div className="flex flex-row items-center justify-center gap-4 mt-4">
          <Table className="border-y w-full">
            <TableHeader className="bg-zinc-600/10">
              <TableRow className="w-full">
                <TableHead>Numero</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Demadeur</TableHead>
                <TableHead>Technicien</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requetes && requetes.length > 0 ? (
                requetes.map((requete) => (
                  <TableRow
                    key={requete.id}
                    className={cn(
                      "cursor-pointer w-full h-8",
                      requete.dateCloture && "hidden"
                    )}
                  >
                    <TableCell>
                      {format(requete.dateDebut, "yyyyMMdd_HHmm") +
                        "_" +
                        requete.logiciel +
                        "_#"}
                    </TableCell>
                    <TableCell>{requete.sujet}</TableCell>
                    <TableCell>{requete.description}</TableCell>
                    <TableCell>{requete.type}</TableCell>
                    <TableCell>{requete.demandeur}</TableCell>
                    <TableCell>{requete.technicien}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Pas de resultat
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
