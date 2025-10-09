import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DownloadTab() {
  return (
    <div className="flex flex-col container px-5 md:px-8 lg:px-20 mx-auto my-3">
      <Tabs defaultValue="detail">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="detail">Details</TabsTrigger>
          <TabsTrigger value="version">Autre Version</TabsTrigger>
        </TabsList>
        <TabsContent value="detail">
          <Detail />
        </TabsContent>
        <TabsContent value="version">
          <div className="p-5 flex flex-col mx-auto">
            <h2 className="text-2xl font-bold mb-4">Autres Versions</h2>
            <hr className="mb-2" />
            <Table className="mb-4">
              <TableHeader className="border-b">
                <TableRow>
                  <TableHead>
                    <span className="font-bold">Version</span>
                  </TableHead>
                  <TableHead>
                    <span className="font-bold">Date</span>
                  </TableHead>
                  <TableHead>
                    <span className="font-bold">Taille</span>
                  </TableHead>
                  <TableHead>
                    <span className="font-bold">Télécharger</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="w-1/4 font-semibold">
                    2414.245.202508.4
                  </TableCell>
                  <TableCell>04/09/2025</TableCell>
                  <TableCell>170 Mo</TableCell>
                  <TableCell>
                    <a
                      href="https://malisystem.com/download/RHPaie_14.exe"
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      download
                    >
                      Télécharger
                    </a>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/4 font-semibold">
                    2413.236.2001.1
                  </TableCell>
                  <TableCell>12/02/2020</TableCell>
                  <TableCell>167 Mo</TableCell>
                  <TableCell>
                    <a
                      href="https://malisystem.com/download/RHPaie_13.exe"
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      download
                    >
                      Télécharger
                    </a>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const Detail = () => {
  return (
    <div className="p-5 flex flex-col mx-auto">
      <h2 className="text-2xl font-bold mb-4">Présentation générale</h2>
      <hr className="mb-2" />
      <ul className="list-disc list-inside mb-4">
        <li className="mb-2">
          RHPaie est une solution logicielle dédiée à la gestion de la paie pour
          les entreprises.{" "}
        </li>
        <li className="mb-2">
          Le logiciel vise à simplifier les tâches liées aux bulletins de
          salaires, aux congés et absences, au pointage, ainsi qu’aux
          déclarations fiscales et sociales.{" "}
        </li>
        <li className="mb-2">
          Il est proposé au sein d’une suite de modules RH, parmi lesquels on
          trouve :
        </li>
        <li className="mb-2">
          1- TimeSheet (pour la gestion des pointages et heures supplémentaires){" "}
        </li>
        <li className="mb-2">
          2- RHData (gestion globale des ressources humaines){" "}
        </li>
        <li className="mb-2">
          3- RHFacture (module de facturation de services de paie){" "}
        </li>
      </ul>
      <h2 className="text-2xl font-bold my-4">Fonctionnalités principales</h2>
      <hr className="mb-2" />
      <Table className="mb-4">
        <TableHeader className="border-b">
          <TableRow>
            <TableHead>
              <span className="font-bold">Fonctionnalité</span>
            </TableHead>
            <TableHead>
              <span className="font-bold">Description</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-semibold">
              Gestion des bulletins de paie
            </TableCell>
            <TableCell>
              Automatisation de la création et de la gestion des bulletins de
              salaire, avec prise en compte des réglementations en vigueur.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-semibold">
              Gestion des congés et absences
            </TableCell>
            <TableCell>
              Suivi des demandes de congés, des absences et des plannings des
              employés.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-semibold">
              Gestion du pointage
            </TableCell>
            <TableCell>
              Enregistrement des heures de travail, des heures supplémentaires
              et des pauses des employés.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-semibold">
              Déclarations fiscales et sociales
            </TableCell>
            <TableCell>
              Génération automatique des déclarations fiscales et sociales
              conformes aux exigences légales.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-semibold">
              Intégration avec d’autres modules RH
            </TableCell>
            <TableCell>
              Possibilité d’intégrer RHPaie avec d’autres modules de gestion des
              ressources humaines pour une gestion complète du personnel.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <h2 className="text-2xl font-bold my-4">Avantages et positionnement</h2>
      <hr />
      <ul className="list-disc list-inside mt-4">
        <li className="mb-2">
          RHPaie se distingue par sa capacité à automatiser et simplifier les
          processus de gestion de la paie, réduisant ainsi les erreurs et
          améliorant l’efficacité administrative.{" "}
        </li>
        <li className="mb-2">
          Le logiciel est conçu pour être conforme aux réglementations locales,
          ce qui est crucial pour les entreprises opérant dans des
          environnements réglementés.{" "}
        </li>
        <li className="mb-2">
          En s’intégrant avec d’autres modules RH, RHPaie offre une solution
          complète pour la gestion des ressources humaines, facilitant la
          gestion du personnel au sein des entreprises.{" "}
        </li>
        <li className="mb-2">
          En résumé, RHPaie est une solution logicielle robuste et complète pour
          la gestion de la paie, adaptée aux besoins des entreprises cherchant à
          optimiser leurs processus RH.
        </li>
      </ul>
    </div>
  );
};
