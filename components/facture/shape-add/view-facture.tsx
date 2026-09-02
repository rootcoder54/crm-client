import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import Image from "next/image";

interface FactureViewProps {
  facture: {
    numero: string;
    date: string;
    client: string;
    clientId: string;
    items: {
      reference: string;
      description: string;
      quantity: number;
      unitPrice: number;
      remise: number | undefined;
      tva: number | undefined;
      total: number | undefined;
    }[];
    totalHT: number;
    totalRemise: number;
    totalTVA: number;
    totalTTC: number;
  };
  open: boolean;
  close?: () => void;
}

export function FactureView({ facture, open = false, close }: FactureViewProps) {
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogTrigger />
      <DialogContent className="sm:min-w-[calc(100%-1rem)] lg:min-w-[calc(100%-10rem)] xl:min-w-[calc(100%-30rem)] min-h-[calc(100%-25rem)] max-w-screen max-h-screen p-10">
        <DialogHeader>
          <DialogTitle>Facture Numero {facture.numero}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <ScrollArea className="rounded-md border border-2 p-10 min-w-[calc(100%-25rem)] min-h-[calc(100%-205rem)] max-w-screen max-h-screen">
          <div className="flex flex-col h-full w-full text-xl">
            <Image
              src="/factureheader.png"
              alt="facture header"
              width={1000}
              height={100}
              className="w-full"
            />
            <div className="flex flex-row items-start mt-10">
              <div className="flex flex-col">
                <div className="grid grid-cols-3 gap-4">
                  <span>FACTURE N° </span>
                  <span className="text-center">:</span>
                  <span>{facture.numero}</span>
                  <span>Date </span>
                  <span className="text-center">:</span>
                  <span>{facture.date}</span>
                  <span>Doit </span>
                  <span className="text-center">:</span>
                  <span>{facture.client}</span>
                  <span>N° Client </span>
                  <span className="text-center">:</span>
                  <span>{facture.clientId}</span>
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
                  {facture.items.map((item, key) => (
                    <TableRow key={key} className="hover:bg-gray-100 h-full">
                      <TableCell className="text-lg border border-black">
                        {item.reference}
                      </TableCell>
                      <TableCell className="text-lg border border-black h-full">
                        <p className="text-balance">{item.description}</p>
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

            <div className="grid grid-cols-2 mt-10">
              <div className="flex flex-col">
                <span>Arrêté la présente facture à la somme de :</span>
                <span className="font-bold text-lg">
                  {facture.totalTTC} francs
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="grid grid-cols-2 gap-6 justify-items-end">
                  <span className="text-lg">Total HT :</span>
                  <span className="text-lg">{facture.totalHT}</span>
                  <span className="text-lg">Total Remises :</span>
                  <span className="text-lg">{facture.totalRemise}</span>
                  <span className="text-lg">TVA 18% :</span>
                  <span className="text-lg">{facture.totalTVA}</span>
                  <span className="text-lg">Total TTC :</span>
                  <span className="text-lg">{facture.totalTTC}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 mt-10 justify-items-center h-50">
              <div className="flex flex-col items-start w-full">
                <span className="text-start">Pour Acquit</span>
              </div>
              <span>Direction</span>
            </div>

            <hr className="mt-10" />
            <div className="flex flex-col mt-2 text-center mb-3">
              <p>
                SARL au capital de 1 000 000 FCFA; N°R.C :3061 NIF 084106089P
                N°Compte BMS : 006809020149 ; ECOBANK : 101467804015
              </p>
              <p>
                Rond point CABRAL, Rue 269 Porte 606 Lafiabougou, B.P 5054,
                Bamako, Mali
              </p>
              <p>
                Tel (+223) 76 47 51 89 / 20 29 89 61 - Email :
                email@malisystem.com
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
