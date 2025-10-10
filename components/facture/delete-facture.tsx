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

import { Facture } from "@prisma/client";
import { Ban, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { deleteFacture } from "@/services/facture.service";

const DeleteFacture = ({ facture }: { facture: Facture }) => {
  const router = useRouter();
  const [isPending, transition] = useTransition();
  const handleCancel = () => {
    router.back();
  };

  const handlerDelete = () => {
    transition(() => {
      deleteFacture(facture.id).then((data) => {
        toast.info(`Facture N° ${data.numero} a été supprimé`);
        router.push("/facture");
      });
    });
  };

  return (
    <AlertDialog open>
      <AlertDialogContent>
        {isPending ? (
          <div className="w-full flex flex-col items-center">
            <Spinner />
          </div>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Etez-vous absolument sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action sera irreversible. Il sera definitivement supprimer
                du serveur.
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
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteFacture;
