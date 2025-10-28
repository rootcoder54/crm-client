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

import { Client } from "@prisma/client";
import { Ban, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { deleteClient } from "@/services/client.service";
import { useSession } from "next-auth/react";
import { createLog } from "@/services/log.service";

const DeleteClient = ({ client }: { client: Client }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, transition] = useTransition();
  const handleCancel = () => {
    router.back();
  };

  const handlerDelete = () => {
    transition(() => {
      deleteClient(client.id).then((data) => {
        createLog({
          action: "Suppression de Client",
          details: `Client ${data.nomClient} a été supprimé`,
          userId: session?.user.id ?? ""
        }).then(() => {
          toast.info(`Client ${data.nomClient} a été supprimé`);
          router.push("/client");
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

export default DeleteClient;
