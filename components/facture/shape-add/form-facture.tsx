"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { LoaderOne } from "@/components/ui/loader";
import { useQuery } from "@tanstack/react-query";
import { Client } from "@prisma/client";
import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { createFacture, maxorder } from "@/services/facture.service";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import HeaderPage from "@/components/features/header-page";
import { Ban, Printer, Save } from "lucide-react";
import { FactureView } from "./view-facture";
import { createItemFacture } from "@/services/itemFacture.service";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

type Item = {
  reference: string;
  description: string;
  quantity: number;
  unitPrice: number;
  remise: number | undefined;
  tva: number | undefined;
  total: number;
};

export function FactureForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { data: clientList, isLoading } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => fetcher(`/api/client`)
  });

  const [openClient, setopenClient] = useState<boolean>(false);
  const [openView, setopenView] = useState<boolean>(false);

  const [order, setorder] = useState<number>();
  const [numero, setnumero] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [clientId, setclientId] = useState<string | null>(null);
  const [type, setType] = useState<string>("FACTURE");
  const [devise, setDevise] = useState<string>("CFA");
  const [modeReglement, setmodeReglement] = useState<string>("Espèce");
  const [observation, setObservation] = useState<string>("");
  const [itemFacture, setItemFacture] = useState<Item[]>([]);

  const STORAGE_KEY = "facture-form-draft";
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setHydrated(true);
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      //setorder(data.order);
      setnumero(data.numero ?? "");
      setDate(data.date ? new Date(data.date) : new Date());
      setclientId(data.clientId ?? null);
      setType(data.type ?? "FACTURE");
      setDevise(data.devise ?? "CFA");
      setmodeReglement(data.modeReglement ?? "Espèce");
      setObservation(data.observation ?? "");
      setItemFacture(data.itemFacture ?? []);
    } catch (error) {
      console.error("Erreur lors du chargement du brouillon :", error);
      setHydrated(true);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const data = {
      //order,
      numero,
      date: date.toISOString(),
      clientId,
      type,
      devise,
      modeReglement,
      observation,
      itemFacture
    };
    console.log(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [
    //order,
    hydrated,
    numero,
    date,
    clientId,
    type,
    devise,
    modeReglement,
    observation,
    itemFacture
  ]);

  const addFactureItemBtn = () => {
    if (!clientId) {
      toast.warning("Veuillez sélectionner un client d'abord.");
      return;
    }
    setItemFacture((prev) => [
      ...prev,
      {
        reference:
          clientList?.filter((client) => client.id === clientId)[0]?.numero +
            (prev.length + 1).toString() || "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        remise: 0,
        tva: 18,
        total: 0
      }
    ]);
  };

  const removeIntervention = (ref: string) => {
    setItemFacture((prev) => prev.filter((item) => item.reference !== ref));
  };

  const handleItemChange = (index: number, values: Item) => {
    setItemFacture((prev) =>
      prev.map((item, i) => (i === index ? values : item))
    );
  };

  const handerViewFacture = () => {
    if (!clientId) {
      toast.warning("Veuillez sélectionner un client d'abord.");
      return;
    }
    setopenView(true);
  };

  const handerCloseViewFacture = () => {
    setopenView(false);
  };

  const handlerCancel = () => {
    router.back();
  };

  const handleReset = () => {
    //setorder(undefined);
    setnumero("");
    setDate(new Date());
    setclientId(null);
    setType("FACTURE");
    setDevise("CFA");
    setmodeReglement("Espèce");
    setObservation("");
    setItemFacture([]);

    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSave = () => {
    if (!numero || !date || !clientId || itemFacture.length === 0) {
      toast.warning(
        "Veuillez remplir tous les champs obligatoires avant d'enregistrer."
      );
      return;
    }
    startTransition(() => {
      const totalHT = itemFacture.reduce(
        (acc, item) => acc + item.unitPrice * item.quantity,
        0
      );
      const totalTTC = itemFacture.reduce((acc, item) => acc + item.total, 0);
      const totalTVA = itemFacture.reduce(
        (acc, item) =>
          acc + (item.unitPrice * item.quantity * (item.tva || 0)) / 100,
        0
      );
      createFacture({
        numero,
        date,
        type,
        acquittee: false,
        numeroOrdre: order,
        modeReglement,
        devise,
        observation,
        clientId,
        totalHT,
        totalTVA,
        totalTTC
      }).then((facture) => {
        //toast.success("Facture ajoutée avec succès");
        const promises = itemFacture.map((item) => {
          const donnee = {
            reference: item.reference,
            libelle: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            remise: item.remise,
            tva: item.tva,
            total: item.total,
            factureId: facture.id
          };
          return createItemFacture(donnee);
        });

        Promise.all(promises).then(() => {
          localStorage.removeItem(STORAGE_KEY);
          toast.success("Facture enregistrée avec succès");
          router.push("/facture");
        });
      });
    });
  };

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await maxorder(); // si c’est une server action valide
      setorder(res + 1);
      console.log("max order:", res);
    };
    fetchOrder();
  }, []);

  if (isPending) {
    return (
      <AlertDialog open={true}>
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle />
            <LoaderOne />
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <HeaderPage
        chemins={[
          { title: "Facture", url: "/facture" },
          { title: "Ajouter une facture", url: "#" }
        ]}
      >
        <Button onClick={handleSave}>
          <Save />
          Enregistrer
        </Button>
        <Button variant={"outline"} onClick={handerViewFacture}>
          <Printer />
          Aperçu
        </Button>
        <Button variant={"blue"} onClick={handleReset}>
          <RotateCcw />
          Reset
        </Button>
        <Button variant={"danger"} onClick={handlerCancel}>
          <Ban />
          Annuler
        </Button>
      </HeaderPage>

      <div className="">
        <div className="flex flex-row h-full w-full border-t-2 my-5">
          <div className="flex flex-col h-full w-4/6 px-2">
            <h2 className="flex flex-col items-center justify-center text-center mt-5">
              <span className="text-2xl font-bold text-gray-700">{type}</span>
            </h2>
            <div className="flex flex-row items-start mt-3">
              <div className="flex flex-col gap-2">
                <div className="flex">
                  <div className="w-46 flex-auto">
                    <span>FACTURE N° </span>
                  </div>
                  <div className="w-14 flex-none">
                    <span className="text-center">:</span>
                  </div>
                  <div className="w-full flex-auto">
                    <span>{numero || "Pas de numero"}</span>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-46 flex-auto">
                    <span>Date </span>
                  </div>
                  <div className="w-14 flex-none">
                    <span className="text-center">:</span>
                  </div>
                  <div className="w-full flex-auto">
                    <span>
                      <Popover>
                        <PopoverTrigger>
                          <Button
                            variant="outline"
                            id="date-picker-simple"
                            className="justify-start font-normal"
                          >
                            {date ? (
                              format(date, "dd/MM/yyyy")
                            ) : (
                              <span>date</span>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            required
                            onSelect={setDate}
                            defaultMonth={date}
                          />
                        </PopoverContent>
                      </Popover>
                    </span>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-46 flex-auto">
                    <span>Client </span>
                  </div>
                  <div className="w-14 flex-none">
                    <span className="text-center">:</span>
                  </div>
                  <div className="w-full flex-auto">
                    <Popover open={openClient} onOpenChange={setopenClient}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full text-start font-normal flex flex-row items-center px-2 py-1 border rounded-md ",
                            !clientId && "text-muted-foreground "
                          )}
                        >
                          {clientId
                            ? clientList?.find(
                                (client) => client.id === clientId
                              )?.nomClient
                            : "Selectionner le client"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        {isLoading ? (
                          <LoaderOne />
                        ) : (
                          <Command>
                            <CommandInput placeholder="Recherche client..." />
                            <CommandList>
                              <CommandEmpty>Pas de client.</CommandEmpty>
                              <CommandGroup>
                                {clientList?.map((client) => (
                                  <CommandItem
                                    value={client.nomClient}
                                    key={client.id}
                                    onSelect={() => {
                                      if (!client.numero) {
                                        toast.warning(
                                          "Le client sélectionné n'a pas de numéro. Veuillez vérifier les informations du client."
                                        );
                                        return;
                                      }
                                      setclientId(client.id);
                                      setnumero(
                                        new Date().getFullYear().toString() +
                                          "/" +
                                          (order || 1)
                                            .toString()
                                            .padStart(4, "0") +
                                          "/" +
                                          client.numero
                                      );
                                      setopenClient(false);
                                    }}
                                  >
                                    {client.nomClient}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        client.id === clientId
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-46 flex-auto">
                    <span>N° Client </span>
                  </div>
                  <div className="w-14 flex-none">
                    <span className="text-center">:</span>
                  </div>
                  <div className="w-full flex-auto">
                    <span>
                      {clientList?.find((client) => client.id === clientId)
                        ?.numero || "Pas de client"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col mt-10">
              <Table className="w-full max-w-full">
                <TableHeader className="border-none">
                  <TableRow className="bg-gray-200 hover:bg-gray-300">
                    <TableHead className="text-lg border border-black">
                      Ref.
                    </TableHead>
                    <TableHead className="text-lg border border-black">
                      Description
                    </TableHead>
                    <TableHead className="text-lg border border-black">
                      Quantité
                    </TableHead>
                    <TableHead className="text-lg border border-black">
                      PUHT
                    </TableHead>
                    <TableHead className="text-lg border border-black">
                      Remise %
                    </TableHead>
                    <TableHead className="text-lg border border-black">
                      TVA %
                    </TableHead>
                    <TableHead className="text-lg border border-black">
                      Total
                    </TableHead>
                    <TableHead className="bg-white border-none"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border-none">
                  {itemFacture.map((item, i) => (
                    <FormItem
                      key={i}
                      values={item}
                      onChange={(values) => handleItemChange(i, values)}
                      removeItem={removeIntervention}
                    />
                  ))}
                  <TableRow className="hover:bg-gray-100/5">
                    <TableCell
                      colSpan={7}
                      className="text-sm text-center hover:bg-gray-100/5 border"
                    >
                      <span className="font-medium text-base">
                        Ajouter un item
                      </span>
                      <Button
                        variant="blue"
                        size="icon"
                        type="button"
                        onClick={addFactureItemBtn}
                        className="ml-2"
                      >
                        <Plus />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-2 mt-10">
              <div className="flex flex-col">
                <span>Arrêté la présente facture à la somme de :</span>
                <span className="font-bold text-lg">
                  {itemFacture
                    .reduce((acc, item) => acc + item.total, 0)
                    .toFixed(2)}{" "}
                  FCFA
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="grid grid-cols-2 gap-2 justify-items-end">
                  <span className="text-lg">Total HT :</span>
                  <span className="text-lg">
                    {itemFacture
                      .reduce(
                        (acc, item) => acc + item.unitPrice * item.quantity,
                        0
                      )
                      .toFixed(2)}{" "}
                    FCFA
                  </span>
                  <span className="text-lg">Total Remises :</span>
                  <span className="text-lg">0</span>
                  <span className="text-lg">TVA 18% :</span>
                  <span className="text-lg">
                    {itemFacture
                      .reduce(
                        (acc, item) =>
                          acc +
                          (item.unitPrice * item.quantity * (item.tva || 0)) /
                            100,
                        0
                      )
                      .toFixed(2)}{" "}
                    FCFA
                  </span>
                  <span className="text-lg">Total TTC :</span>
                  <span className="text-lg">
                    {itemFacture
                      .reduce((acc, item) => acc + item.total, 0)
                      .toFixed(2)}{" "}
                    FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col h-full w-2/6 text-lg border-l-2 ">
            <div className="flex flex-col p-3 bg-gray-200 text-xl">
              <span>Parametres</span>
            </div>
            <div className="flex flex-col p-3 gap-2">
              <div className="flex flex-col gap-2">
                <span>Type de Facture</span>
                <Combobox
                  items={["FACTURE", "PROFORMA"]}
                  defaultValue={type}
                >
                  <ComboboxInput value={type} />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem
                          key={item}
                          value={item}
                          onClick={() => setType(item)}
                        >
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
              <div className="flex flex-col gap-2">
                <span>Devise</span>
                <Combobox items={["CFA", "EURO", "USD"]} defaultValue={devise}>
                  <ComboboxInput value={devise} />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem
                          key={item}
                          value={item}
                          onClick={() => setDevise(item)}
                        >
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
              <div className="flex flex-col gap-2">
                <span>Mode de Reglement</span>
                <Combobox
                  items={["Espèce", "Virement", "Cheque"]}
                  defaultValue={modeReglement}
                >
                  <ComboboxInput value={modeReglement} />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem
                          key={item}
                          value={item}
                          onClick={() => setmodeReglement(item)}
                        >
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
              <div className="flex flex-col gap-2">
                <span>Ordre</span>
                <Input
                  type="number"
                  value={order}
                  onChange={(e) => setorder(Number(e.target.value))}
                  className="bg-zinc-100 text-black"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <span>Observation</span>
                <Textarea
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <FactureView
        facture={{
          numero: numero,
          date: format(date, "dd/MM/yyyy"),
          client:
            clientList?.find((client) => client.id === clientId)?.nomClient ||
            "",
          clientId:
            clientList?.find((client) => client.id === clientId)?.numero || "",
          items: itemFacture || [],
          totalHT: itemFacture.reduce(
            (acc, item) => acc + item.unitPrice * item.quantity,
            0
          ),
          totalRemise: 0,
          totalTVA: itemFacture.reduce(
            (acc, item) =>
              acc + (item.unitPrice * item.quantity * (item.tva || 0)) / 100,
            0
          ),
          totalTTC: itemFacture.reduce((acc, item) => acc + item.total, 0)
        }}
        open={openView}
        close={handerCloseViewFacture}
      />
    </div>
  );
}

const FormItem = ({
  values,
  onChange,
  removeItem
}: {
  values: Item;
  onChange: (values: Item) => void;
  removeItem?: (ref: string) => void;
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
    <TableRow className="hover:bg-white h-full border-none">
      <TableCell className="text-lg border border-black">
        {values.reference}
      </TableCell>
      <TableCell className="text-lg border border-black w-[300px]">
        <Textarea
          value={values.description}
          onChange={handleChange("description")}
        />
      </TableCell>
      <TableCell className="text-lg border border-black">
        <Input
          type="number"
          value={values.quantity}
          onChange={handleChange("quantity")}
        />
      </TableCell>
      <TableCell className="text-lg border border-black w-[180px]">
        <Input
          type="number"
          value={values.unitPrice}
          onChange={handleChange("unitPrice")}
        />
      </TableCell>
      <TableCell className="text-lg border border-black">
        <Input
          type="number"
          value={values.remise}
          onChange={handleChange("remise")}
        />
      </TableCell>
      <TableCell className="text-lg border border-black">
        <Input
          type="number"
          value={values.tva}
          onChange={handleChange("tva")}
        />
      </TableCell>
      <TableCell className="text-lg border border-black w-[180px]">
        <Input type="number" value={values.total} readOnly />
      </TableCell>
      <TableCell className="border-none">
        <Trash2
          className="transition duration-300 hover:text-red-700 hover:rotate-20 cursor-pointer"
          onClick={() => removeItem && removeItem(values.reference)}
        />
      </TableCell>
    </TableRow>
  );
};
