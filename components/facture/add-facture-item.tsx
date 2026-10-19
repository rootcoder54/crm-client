"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { useEffect, useState, useTransition } from "react";
import { OctagonX, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderOne } from "../ui/loader";
import { createItemFacture } from "@/services/itemFacture.service";
import HeaderPage from "../features/header-page";

type Item = {
  reference: string;
  libelle: string;
  quantity: number;
  unitPrice: number;
  remise: number | undefined;
  tva: number | undefined;
  total: number;
};

export const AddFactureItem = ({ factureId }: { factureId: string }) => {
  const [isPending, transition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    console.log("compilé maintenant");
  }, []);

  const [itemFacture, setItemFacture] = useState<Item[]>([
    {
      reference: "",
      libelle: "",
      quantity: 0,
      unitPrice: 0,
      remise: 0,
      tva: 18,
      total: 0
    }
  ]);

  const addFactureItemBtn = () => {
    setItemFacture((prev) => [
      ...prev,
      {
        reference: "",
        libelle: "",
        quantity: 0,
        unitPrice: 0,
        remise: 0,
        tva: 18,
        total: 0
      }
    ]);
  };

  const removeIntervention = () => {
    setItemFacture((prev) => prev.slice(0, -1));
  };

  const handleItemChange = (index: number, values: Item) => {
    setItemFacture((prev) =>
      prev.map((item, i) => (i === index ? values : item))
    );
  };

  const handlerSubmit = () => {
    transition(() => {
      const promises = itemFacture.map((item) => {
        const donnee = {
          reference: item.reference,
          libelle: item.libelle,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          remise: item.remise,
          tva: item.tva,
          total: item.total,
          factureId: factureId
        };
        createItemFacture(donnee).then((it) => {
          console.log(it);
        });
      });

      Promise.all(promises).then(() => {
        toast.success(`Items de facture enregistrés avec succès`);
        router.push(`/facture`);
      });
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <form>
        <HeaderPage
          chemins={[
            { title: "Factures", url: "/facture" },
            { title: "Nouvelle Facture", url: "#" }
          ]}
        >
          <Button type="button" variant={"danger"} onClick={handleBack}>
            Annuler
          </Button>
          <Button type="button" variant={"gray"} onClick={handlerSubmit}>
            Enregistrer
          </Button>
        </HeaderPage>

        {!isPending ? (
          <>
            <h3 className="text-lg font-semibold mb-2 mt-3">
              Saisir les details de la facture
            </h3>
            {itemFacture.map((item, i) => (
              <FormIntervention
                key={i}
                values={item}
                onChange={(values) => handleItemChange(i, values)}
              />
            ))}
            <div className="flex flex-row items-center gap-x-3">
              <Button
                variant="secondary"
                size="icon"
                type="button"
                onClick={addFactureItemBtn}
              >
                <Plus />
              </Button>
              {itemFacture.length > 1 && (
                <Button
                  variant="secondary"
                  size="icon"
                  type="button"
                  onClick={removeIntervention}
                >
                  <OctagonX />
                </Button>
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2 mt-3">
              Total de la facture
            </h3>

            <div className="grid grid-cols-7 gap-x-2 p-3 border rounded-md border-gray-400 mb-3 mt-3">
              <div className="col-span-6 text-right font-semibold">
                Total TVA:
              </div>
              <div className="col-span-1 text-right font-semibold">
                {itemFacture
                  .reduce(
                    (acc, item) =>
                      acc +
                      (item.unitPrice * item.quantity * (item.tva || 0)) / 100,
                    0
                  )
                  .toFixed(2)}{" "}
                FCFA
              </div>
              <div className="col-span-6 text-right font-semibold">
                Total HT:
              </div>
              <div className="col-span-1 text-right font-semibold">
                {itemFacture
                  .reduce(
                    (acc, item) => acc + item.unitPrice * item.quantity,
                    0
                  )
                  .toFixed(2)}{" "}
                FCFA
              </div>
              <div className="col-span-6 text-right font-semibold">
                Total TTC:
              </div>
              <div className="col-span-1 text-right font-semibold">
                {itemFacture
                  .reduce((acc, item) => acc + item.total, 0)
                  .toFixed(2)}{" "}
                FCFA
              </div>
            </div>
          </>
        ) : (
          <div className="w-full flex items-center justify-center">
            <LoaderOne />
          </div>
        )}
      </form>
    </div>
  );
};

const FormIntervention = ({
  values,
  onChange
}: {
  values: Item;
  onChange: (values: Item) => void;
}) => {
  useEffect(() => {
    values.total =
      values.quantity *
      values.unitPrice *
      (1 - (values.remise || 0) / 100) *
      (1 + (values.tva || 0) / 100);
    onChange({ ...values, total: values.total });
  }, [values.quantity, values.unitPrice, values.remise, values.tva]);

  const handleChange =
    (field: keyof Item) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (field !== "total") {
        onChange({ ...values, [field]: e.target.value });
      }
    };

  return (
    <div className="grid grid-cols-7 gap-x-2 p-3 border rounded-md border-gray-400 mb-3 mt-3">
      <Field>
        <FieldLabel>Reference</FieldLabel>
        <Input
          type="text"
          className="w-full"
          value={values.reference}
          onChange={handleChange("reference")}
        />
      </Field>

      <Field>
        <FieldLabel>Libellé</FieldLabel>
        <Input
          type="text"
          className="w-full"
          value={values.libelle}
          onChange={handleChange("libelle")}
        />
      </Field>

      <Field>
        <FieldLabel>Quantité</FieldLabel>
        <Input
          type="number"
          className="w-full"
          value={values.quantity}
          onChange={handleChange("quantity")}
        />
      </Field>

      <Field>
        <FieldLabel>Prix unitaire</FieldLabel>
        <Input
          type="number"
          className="w-full"
          value={values.unitPrice}
          onChange={handleChange("unitPrice")}
        />
      </Field>

      <Field>
        <FieldLabel>Remise %</FieldLabel>
        <Input
          type="number"
          className="w-full"
          value={values.remise}
          onChange={handleChange("remise")}
        />
      </Field>

      <Field>
        <FieldLabel>TVA %</FieldLabel>
        <Input
          type="number"
          className="w-full"
          value={values.tva}
          onChange={handleChange("tva")}
        />
      </Field>

      <Field>
        <FieldLabel>Total</FieldLabel>
        <Input
          type="number"
          className="w-full border border-b-2 border-gray-600 focus:border-gray-400 focus:ring-2 text-black"
          value={values.total}
          onChange={handleChange("total")}
          disabled
        />
      </Field>
    </div>
  );
};
