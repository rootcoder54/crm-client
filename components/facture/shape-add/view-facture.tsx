import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import Image from "next/image";

export function FactureForm() {
  return (
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
            <span>12345</span>
            <span>Date </span>
            <span className="text-center">:</span>
            <span>2026/09/01</span>
            <span>Doit </span>
            <span className="text-center">:</span>
            <span>Etasi Sarl</span>
            <span>N° Client </span>
            <span className="text-center">:</span>
            <span>0546</span>
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
            <TableRow className="hover:bg-gray-100 h-full">
              <TableCell className="text-lg border border-black">
                5461
              </TableCell>
              <TableCell className="text-lg border border-black h-full">
                <p className="text-balance">
                  Achat de logiciel Lorem ipsum, dolor sit amet consectetur
                  adipisicing elit. Aliquam quo, corporis repudiandae officiis
                  corrupti, libero a odio voluptates autem commodi, hic nulla
                  sapiente. Fugit repellat odio porro a repellendus molestias.
                </p>
              </TableCell>
              <TableCell className="text-lg border border-black">1</TableCell>
              <TableCell className="text-lg border border-black">
                450000
              </TableCell>
              <TableCell className="text-lg border border-black">0</TableCell>
              <TableCell className="text-lg border border-black">18</TableCell>
              <TableCell className="text-lg border border-black">
                450000
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-gray-100 h-full">
              <TableCell className="text-lg border border-black">
                5462
              </TableCell>
              <TableCell className="text-lg border border-black h-full">
                <p className="text-balance">
                  Achat de logiciel Lorem ipsum, dolor sit amet consectetur
                  adipisicing elit. Aliquam quo, corporis repudiandae officiis
                  corrupti, libero a odio voluptates autem commodi, hic nulla
                  sapiente. Fugit repellat odio porro a repellendus molestias.
                </p>
              </TableCell>
              <TableCell className="text-lg border border-black">1</TableCell>
              <TableCell className="text-lg border border-black">
                100000
              </TableCell>
              <TableCell className="text-lg border border-black">0</TableCell>
              <TableCell className="text-lg border border-black">18</TableCell>
              <TableCell className="text-lg border border-black">
                100000
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-2 mt-10">
        <div className="flex flex-col">
          <span>Arrêté la présente facture à la somme de :</span>
          <span className="font-bold text-lg">
            Cinq cent cinquante mille francs
          </span>
        </div>
        <div className="flex flex-col items-end">
          <div className="grid grid-cols-2 gap-6 justify-items-end">
            <span className="text-lg">Total HT :</span>
            <span className="text-lg">550 000</span>
            <span className="text-lg">Total Remises :</span>
            <span className="text-lg">0</span>
            <span className="text-lg">TVA 18% :</span>
            <span className="text-lg">99 000</span>
            <span className="text-lg">Total TTC :</span>
            <span className="text-lg">649 000</span>
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
          SARL au capital de 1 000 000 FCFA; N°R.C :3061 NIF 084106089P N°Compte
          BMS : 006809020149 ; ECOBANK : 101467804015
        </p>
        <p>
          Rond point CABRAL, Rue 269 Porte 606 Lafiabougou, B.P 5054, Bamako,
          Mali
        </p>
        <p>
          Tel (+223) 76 47 51 89 / 20 29 89 61 - Email : email@malisystem.com
        </p>
      </div>
    </div>
  );
}
