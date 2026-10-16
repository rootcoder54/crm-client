import Image from "next/image";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { getInterventionById } from "@/services/intervention.service";
import PrintButton from "@/components/features/print";

interface FicheIdPageProps {
  params: Promise<{ id: string }>;
}

const FicheIntervention = async ({ params }: FicheIdPageProps) => {
  const { id } = await params;
  const intervention = await getInterventionById(id);
  if (!intervention) {
    return <div className="text-center text-red-500">Client non trouvé</div>;
  }
  return (
    <div id="pdf-content" className="max-h-full p-10 py-5 space-y-3">
      <PrintButton />
      <div className="flex flex-col mx-auto">
        <div className="flex flex-row items-end justify-start gap-2 mb-2 border-b border-zinc-900">
          <Image
            src={"/msys.png"}
            alt="logo"
            className=""
            width={35}
            height={64}
          />
          <h2 className="text-2xl font-bold">MALISYSTEM</h2>
        </div>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2} className="py-1 pb-0 px-1">
                <div>
                  <span className="font-bold">
                    Créateur: {intervention.creePar}
                  </span>
                </div>
              </TableCell>
              <TableCell colSpan={2} className="py-1 pb-0 px-1">
                <div>
                  <span className="font-bold">Dernier modificateur :</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border-2 border-zinc-800 py-3 px-1">
                <div className="flex flex-col">
                  <span className="font-bold">
                    Fiche d&apos;intervention n° :
                  </span>
                  <span>
                    {intervention.client?.numero}/
                    {format(intervention.createdAt, "yyyy")}
                  </span>
                </div>
              </TableCell>
              <TableCell className="border-2 border-zinc-800 py-3 px-1">
                <div className="flex flex-col">
                  <span className="font-bold">Date de création :</span>
                  <span>{format(intervention.createdAt, "dd/MM/yyyy")}</span>
                </div>
              </TableCell>
              <TableCell className="border-2 border-zinc-800 py-3 px-1">
                <div className="flex flex-col">
                  <span className="font-bold">Heure de création :</span>
                  <span>{format(intervention.createdAt, "HH:mm")}</span>
                </div>
              </TableCell>
              <TableCell className="border-2 border-zinc-800 py-3 px-1">
                <div className="flex flex-col">
                  <span className="font-bold">Service concerné :</span>
                  <span> {intervention.service}</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                className="border-2 border-zinc-800 py-3 px-1"
                colSpan={2}
              >
                <div className="flex flex-row">
                  <span className="font-bold">Nom du client :</span>
                  <span className="ml-2">{intervention.client?.nomClient}</span>
                </div>
              </TableCell>
              <TableCell
                className="border-2 border-zinc-800 py-3 px-1"
                colSpan={2}
              >
                <div className="flex flex-row">
                  <span className="font-bold">Intervenants :</span>
                  <span className="ml-2">{intervention.intervenant}</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                className="border-2 border-zinc-800 py-1 h-9 px-1"
                colSpan={4}
              >
                <div className="flex flex-row justify-between">
                  <div>
                    <span className="font-bold">Adresse : </span>
                    <span>{intervention.client?.adresse}</span>
                  </div>
                  <div>
                    <span className="font-bold">Téléphone : </span>
                    <span>{intervention.client?.telephone}</span>
                  </div>
                  <div>
                    <span className="font-bold">Fax : </span>
                    <span className="ml-2"></span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                className="border-2 border-b-0 border-zinc-800 bg-zinc-200 text-center p-0"
                colSpan={4}
              >
                <span className="font-bold">Matériel concerné</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="border-2 border-zinc-800 py-1">
                <span className="font-bold">Référence</span>
              </TableCell>
              <TableCell className="border-2 border-r-0 border-zinc-800 py-1">
                <span className="font-bold">Désignation</span>
              </TableCell>
              <TableCell className="border-2 border-l-0 border-zinc-800 py-1"></TableCell>
              <TableCell className="border-2 border-zinc-800 py-1">
                <span className="font-bold">Fabricant</span>
              </TableCell>
              <TableCell className="border-2 border-zinc-800 py-1">
                <span className="font-bold">Nouv.com</span>
              </TableCell>
              <TableCell className="border-2 border-zinc-800 py-1">
                <span className="font-bold">Anc .com</span>
              </TableCell>
              <TableCell className="border-2 border-zinc-800 py-1">
                <span className="font-bold">Différence</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={7}
                className="border-2 border-zinc-800 py-3"
              ></TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={7} className="border-2 border-zinc-800 py-2">
                <div className="flex gap-x-3">
                  <span className="font-bold">Déplacement facturé :</span>
                  <span>{intervention.afacturee ? "Oui" : "Non"}</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={7} className="border-2 border-zinc-800 py-1">
                <div className="flex items-center justify-center w-full text-center">
                  <span className="font-bold text-center">
                    Nature de l&apos;intervention :
                  </span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={7}
                className="border-2 border-b-0 border-zinc-800 py-4 text-center"
              >
                <span>{intervention.nature}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={4}
                className="border-2 border-zinc-800 py-2 bg-zinc-200"
              >
                <div className="flex items-center justify-center w-full text-center">
                  <span
                    className="font-bold text-center"
                    style={{ letterSpacing: "12px" }}
                  >
                    INTERVENTIONS:
                  </span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border-2 border-zinc-800 py-1">
                <span className="font-bold">Date:</span>
              </TableCell>
              <TableCell className="border-2 border-zinc-800 py-1">
                <span className="font-bold">Heure début:</span>
              </TableCell>
              <TableCell className="border-2 border-zinc-800 py-1">
                <span className="font-bold">Heure fin:</span>
              </TableCell>
              <TableCell className="border-2 border-zinc-800 w-1/2 py-1">
                <span className="font-bold">Descriptif:</span>
              </TableCell>
            </TableRow>
            {intervention.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="border-2 border-zinc-800 h-20">
                  {format(item.date, "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="border-2 border-zinc-800 h-20">
                  {item.debut}
                </TableCell>
                <TableCell className="border-2 border-zinc-800 h-20">
                  {item.fin}
                </TableCell>
                <TableCell className="border-2 border-zinc-800 h-20">
                  <span className="text-sm">{item.description}</span>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4} className="border-2 border-zinc-800 py-1">
                <div className="flex items-center justify-center w-full text-center">
                  <span className="font-bold">Observations:</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} className="border-2 border-zinc-800 h-24">
                {intervention.observations}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="flex items-start h-7 mb-4 mt-2 gap-2">
          <span className="font-bold">Date de clôture</span>
          <span>{format(intervention.dateCloture, "dd/MM/yyyy")}</span>
        </div>
        <div className="flex justify-between h-40 border-b-2 border-black">
          <div className="flex flex-col space-y-2">
            <span className="font-bold">Le client</span>
            <span className="text-sm">Accord sur livraison ou prestation</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-bold text-xl">MALISYSTEM S.A.R</span>
            <span className="text-sm">Nom et Signature</span>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col items-center font-semibold">
            <span>au capital de 0; N°RC: 0 NIF:N° Compte: 0</span>
            <span>LAFIABOUGOU , BP.</span>
            <span>Tel: Fax: - Email: email@malisystem.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FicheIntervention;
