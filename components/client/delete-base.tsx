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

import { Base } from "@prisma/client";
import { Ban, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { deleteBase } from "@/services/base.service";
import { createLog } from "@/services/log.service";
import { useSession } from "next-auth/react";

const DeleteBase = ({ base }: { base: Base }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, transition] = useTransition();
  const handleCancel = () => {
    router.back();
  };

  const handlerDelete = () => {
    transition(() => {
      deleteBase(base.id).then((data) => {
        createLog({
          action: "Suppression de Base",
          details: `Base ${data.societe} a été supprimé`,
          userId: session?.user.id ?? ""
        }).then(() => {
          toast.info(`Base ${data.societe} a été supprimé`);
          router.push("/client/base" + `/${data.clientId}`);
          router.refresh();
        });
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

export default DeleteBase;
