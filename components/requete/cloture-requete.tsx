"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import { clotureRequete } from "@/services/requete.service";

import { Requete } from "@prisma/client";
import { Ban, CalendarCheck2, ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

const ClotureRequete = ({ requete }: { requete: Requete }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const [isPending, transition] = useTransition();
  const handleCancel = () => {
    router.push("/requete");
  };

  const handlerCloture = () => {
    transition(() => {
      clotureRequete(requete.id, date, "CLOTURER").then((data) => {
        toast.info(`Requête ${data.sujet} a été supprimé`);
        router.push("/requete");
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
              <AlertDialogTitle>
                Clôturer le traitement de la Requête !!!
              </AlertDialogTitle>
              <div className="flex flex-col gap-3 w-full">
                <Label htmlFor="date" className="px-1">
                  Clôturé à la date du
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="justify-between font-normal"
                    >
                      {date ? date.toLocaleDateString() : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDate(date || new Date());
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                {" "}
                <Ban /> Annuler
              </AlertDialogCancel>
              <AlertDialogAction variant={"default"} onClick={handlerCloture}>
                {" "}
                <CalendarCheck2 /> Cloturer
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClotureRequete;
