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

import { Intervention, ItemIntervention } from "@prisma/client";
import { Ban, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteItemIntervention } from "@/services/itemIntervention.service";
import { LoaderOne } from "../ui/loader";

const DeleteIntervention = ({
  intervention,
  item
}: {
  intervention: Intervention;
  item: ItemIntervention;
}) => {
  const router = useRouter();
  const [isPending, transition] = useTransition();
  const handleCancel = () => {
    router.back();
  };

  const handlerDelete = () => {
    transition(() => {
      deleteItemIntervention(item.id).then((data) => {
        console.log(data);
        toast.info(`Item a été supprimé`);
        router.push(`/requete/intervention/${intervention.requeteId}`);
      });
    });
  };

  return (
    <AlertDialog open>
      <AlertDialogContent>
        {isPending ? (
          <div className="w-full flex flex-col items-center">
            <LoaderOne />
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

export default DeleteIntervention;
