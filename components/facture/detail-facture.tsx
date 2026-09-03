"use client";

import { useQuery } from "@tanstack/react-query";
import HeaderPage from "../features/header-page";
import { Facture } from "@prisma/client";
import { fetcher } from "@/lib/fetcher";
import { LoaderOne } from "../ui/loader";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { AlertCircleIcon, Printer } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";

export const DetailFacture = ({ idFacture }: { idFacture: string }) => {
  const {
    isError,
    isPending,
    data: facture
  } = useQuery<
    Facture & {
      itemFactures: {
        id: string;
        remise: number | null;
        createdAt: Date;
        updatedAt: Date;
        reference: string;
        libelle: string;
        quantity: number;
        unitPrice: number;
        tva: number | null;
        total: number;
        factureId: string;
      }[];
    }
  >({
    queryKey: ["facture", idFacture],
    queryFn: () => fetcher(`/api/facture/details/${idFacture}`)
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
            <p>Une erreur est survenue lors du chargement des clients.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <HeaderPage
        chemins={[
          { title: "Factures", url: "/facture" },
          { title: "Facture N° " + facture.numero, url: "#" }
        ]}
      >
        <Button variant={"outline"}>
          <Printer />
          Aperçu
        </Button>
      </HeaderPage>
      <div className="flex flex-col h-full w-full text-xl">
        <div className="flex flex-row items-start mt-10">
          <div className="flex flex-col">
            <div className="grid grid-cols-3 gap-4">
              <span>FACTURE N° </span>
              <span className="text-center">:</span>
              <span>{facture.numero}</span>
              <span>Date </span>
              <span className="text-center">:</span>
              <span>{format(facture.date, "dd/MM/yyyy")}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-10">
          <Table className="w-full max-w-full border border-gray-300">
            <TableHeader>
              <TableRow className="bg-gray-200 hover:bg-gray-300 border-black">
                <TableHead className="text-lg border border-black">
                  Ref.
                </TableHead>
                <TableHead className="text-lg border border-black">
                  Description
                </TableHead>
                <TableHead className="text-lg border border-black">
                  Quantité
                </TableHead>
                <TableHead className="text-lg border border-black">
                  PUHT
                </TableHead>
                <TableHead className="text-lg border border-black">
                  Remise %
                </TableHead>
                <TableHead className="text-lg border border-black">
                  TVA %
                </TableHead>
                <TableHead className="text-lg border border-black">
                  Total HT
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facture.itemFactures.map((item, key) => (
                <TableRow key={key} className="hover:bg-gray-100 h-full">
                  <TableCell className="text-lg border border-black">
                    {item.reference}
                  </TableCell>
                  <TableCell className="text-lg border border-black h-full">
                    <p className="text-balance">{item.libelle}</p>
                  </TableCell>
                  <TableCell className="text-lg border border-black">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-lg border border-black">
                    {item.unitPrice}
                  </TableCell>
                  <TableCell className="text-lg border border-black">
                    {item.remise}
                  </TableCell>
                  <TableCell className="text-lg border border-black">
                    {item.tva}
                  </TableCell>
                  <TableCell className="text-lg border border-black">
                    {item.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-10">
          <div className="flex flex-col items-start">
            <div className="grid grid-cols-2 gap-6 justify-items-end">
              <span className="text-lg">Total HT :</span>
              <span className="text-lg">{facture.totalHT}</span>
              <span className="text-lg">Total Remises :</span>
              <span className="text-lg">0</span>
              <span className="text-lg">TVA 18% :</span>
              <span className="text-lg">{facture.totalTVA}</span>
              <span className="text-lg">Total TTC :</span>
              <span className="text-lg">{facture.totalTTC}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
