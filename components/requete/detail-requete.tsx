"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { Requete } from "@prisma/client";
import { format } from "date-fns";

const DetailRequete = ({ requete }: { requete: Requete }) => {
  console.log(requete);
  const handleBack = () => {
    window.history.back();
  };
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[725px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            Detail Requête N°{" "}
            {format(requete.dateDebut, "yyyyMMdd_HHmm") +
              "_" +
              requete.logiciel +
              "_#"}
          </DialogTitle>
          <DialogDescription>
            Voici les informations détaillées de la requête sélectionnée.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Titre
              </p>
              <p className="text-sm text-muted-foreground">{requete.sujet}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Description
              </p>
              <p className="text-sm text-muted-foreground">
                {requete.description}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Type
              </p>
              <p className="text-sm text-muted-foreground">{requete.type}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Observation
              </p>
              <p className="text-sm text-muted-foreground">
                {requete.observation
                  ? requete.observation
                  : "Aucune observation"}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Logiciel
              </p>
              <p className="text-sm text-muted-foreground">
                {requete.logiciel}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Demandeur
              </p>
              <p className="text-sm text-muted-foreground">
                {requete.demandeur}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Technicien
              </p>
              <p className="text-sm text-muted-foreground">
                {requete.technicien ? requete.technicien : "Non assigné"}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Etat
              </p>
              <p className="text-sm text-muted-foreground">
                {requete.etat ? requete.etat : "En Cours"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Date de création
              </p>
              <p className="text-sm text-muted-foreground">
                {requete.dateDebut
                  ? new Date(requete.dateDebut).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Date de clôture
              </p>
              <p className="text-sm text-muted-foreground">
                {requete.dateCloture
                  ? new Date(requete.dateCloture).toLocaleDateString()
                  : "Non clôturée"}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleBack}>
              Retour
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailRequete;
