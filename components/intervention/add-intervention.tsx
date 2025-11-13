"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { useState, useTransition } from "react";
import { format } from "date-fns";
import { OctagonX, Plus } from "lucide-react";
import { Intervention, Requete } from "@prisma/client";
import Link from "next/link";
import { createIntervention } from "@/services/intervention.service";
import { createItemIntervention } from "@/services/itemIntervention.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderOne } from "../ui/loader";

type Item = {
  date: string;
  debut: string;
  fin: string;
  texte: string;
};

export const AddIntervention = ({
  requete
}: {
  requete: Requete & {
    Intervention: Intervention[];
  };
}) => {
  const [isPending, transition] = useTransition();
  const router = useRouter();
  const instance = format(new Date(), "yyyy-MM-dd");

  const [interventions, setInterventions] = useState<Item[]>([
    { date: instance, debut: "00:00", fin: "00:00", texte: "" }
  ]);

  const addInterventionIt = () => {
    setInterventions((prev) => [
      ...prev,
      { date: instance, debut: "", fin: "", texte: "" }
    ]);
  };

  const removeIntervention = () => {
    setInterventions((prev) => prev.slice(0, -1));
  };

  const handleItemChange = (index: number, values: Item) => {
    setInterventions((prev) =>
      prev.map((item, i) => (i === index ? values : item))
    );
  };

  const handlerSubmit = () => {
    transition(() => {
      if (requete.Intervention.length === 0) {
        const data = {
          numero:
            format(requete.dateDebut, "yyyyMMdd") +
            "_" +
            requete.logiciel +
            "_#",
          service: "Genie logiciel",
          intervenant: requete.technicien ?? "",
          nature: requete.type ?? "",
          observations: "",
          creePar: "",
          afacturee: true,
          dateCloture: new Date(),
          clientId: requete.clientId ?? undefined,
          requeteId: requete.id
        };
        createIntervention(data)
          .then((result) => {
            interventions.map((intervention) => {
              const donnee = {
                date: new Date(intervention.date),
                debut: intervention.debut,
                fin: intervention.fin,
                description: intervention.texte,
                interventionId: result.id
              };
              createItemIntervention(donnee).then((it) => {
                console.log(it);
              });
            });
          })
          .then(() => {
            toast.success(`Intervention enregistrer avec succès`);
            router.push(`/requete/intervention/${requete.id}`);
          });
      } else {
        Promise.all(
          interventions.map((intervention) => {
            const donnee = {
              date: new Date(intervention.date),
              debut: intervention.debut,
              fin: intervention.fin,
              description: intervention.texte,
              interventionId: requete.Intervention[0].id
            };
            createItemIntervention(donnee).then((it) => {
              console.log(it);
            });
          })
        ).then(() => {
          toast.success(`Intervention enregistrer avec succès`);
          router.push(`/requete/intervention/${requete.id}`);
        });
      }
    });
  };

  return (
    <Dialog open>
      <form>
        <DialogContent showCloseButton={false} className="sm:max-w-[725px]">
          {!isPending ? (
            <>
              <DialogHeader>
                <DialogTitle>Ajouter une Intervention</DialogTitle>
                <DialogDescription>
                  Ajouter une intervention pour la requête {""}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-7 gap-x-2 py-3 border-b">
                <span className="col-span-2">Date</span>
                <span>Debut</span>
                <span>Fin</span>
                <span className="col-span-3">Description</span>
              </div>
              {interventions.map((item, i) => (
                <FormIntervention
                  key={i}
                  values={item}
                  onChange={(values) => handleItemChange(i, values)}
                />
              ))}
              <DialogFooter className="flex flex-row items-center gap-x-3">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={addInterventionIt}
                >
                  <Plus />
                </Button>
                {interventions.length > 1 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={removeIntervention}
                  >
                    <OctagonX />
                  </Button>
                )}
                <Link href={`/requete/intervention/${requete.id}`}>
                  <Button type="button" variant={"danger"}>
                    Annuler
                  </Button>
                </Link>
                <Button type="submit" variant={"blue"} onClick={handlerSubmit}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="w-full flex items-center justify-center">
              <LoaderOne />
            </div>
          )}
        </DialogContent>
      </form>
    </Dialog>
  );
};

const FormIntervention = ({
  values,
  onChange
}: {
  values: Item;
  onChange: (values: Item) => void;
}) => {
  const handleChange =
    (field: keyof Item) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange({ ...values, [field]: e.target.value });
    };

  return (
    <div className="grid grid-cols-7 gap-x-2 py-3 border-b">
      {/* Date */}
      <span className="col-span-2">
        <Input
          type="date"
          className="w-full"
          value={values.date}
          onChange={handleChange("date")}
        />
      </span>

      {/* Heure de début */}
      <span>
        <Input
          type="time"
          value={values.debut}
          onChange={handleChange("debut")}
        />
      </span>

      {/* Heure de fin */}
      <span>
        <Input type="time" value={values.fin} onChange={handleChange("fin")} />
      </span>

      {/* Description */}
      <span className="col-span-3">
        <Textarea
          placeholder="Description de l'intervention"
          value={values.texte}
          onChange={handleChange("texte")}
        />
      </span>
    </div>
  );
};
