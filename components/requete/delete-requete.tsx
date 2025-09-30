"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { deleteRequete } from "@/services/requete.service";

import { Requete } from "@prisma/client";
import { Ban, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DeleteRequete = ({ requete }: { requete: Requete }) => {
  const router = useRouter();
  const handleCancel = () => {
    router.push("/requete");
  };

  const handlerDelete = () => {
    deleteRequete(requete.id).then((data) => {
      toast.info(`Requête ${data.sujet} a été supprimé`);
      router.push("/requete");
    });
  };

  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Etez-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action sera irreversible. Il sera definitivement supprimer du
            serveur.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {" "}
            <Ban /> Annuler
          </AlertDialogCancel>
          <AlertDialogAction variant={"danger"} onClick={handlerDelete}>
            {" "}
            <Trash2 /> Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRequete;
