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
import { Button } from "@/components/ui/button";
import { LoaderOne } from "@/components/ui/loader";
import { useQuery } from "@tanstack/react-query";
import { Client } from "@prisma/client";
import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus,  Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { maxorder } from "@/services/facture.service";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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
  const { data: clientList, isLoading } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => fetcher(`/api/client`)
  });
  const [order, setorder] = useState<number>();
  const [numero, setnumero] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [clientId, setclientId] = useState<string | null>(null);
  const [itemFacture, setItemFacture] = useState<Item[]>([
    
  ]);
  const addFactureItemBtn = () => {
    if(!clientId) {
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
        quantity: 0,
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

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await maxorder(); // si c’est une server action valide
      setorder(res + 1);
      console.log("max order:", res);
    };
    fetchOrder();
  }, []);

  return (
    <div className="flex flex-row h-full w-full border-t-2 my-5">
      <div className="flex flex-col h-full w-4/6 px-2">
        <h2 className="flex flex-col items-center justify-center text-center mt-5">
          <span className="text-2xl font-bold text-gray-700">FACTURE</span>
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
                        {date ? format(date, "dd/MM/yyyy") : <span>date</span>}
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full text-start font-normal flex flex-row items-center px-2 py-1 border rounded-md ",
                        !clientId && "text-muted-foreground "
                      )}
                    >
                      {clientId
                        ? clientList?.find((client) => client.id === clientId)
                            ?.nomClient
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
                                  setclientId(client.id);
                                  setnumero(
                                    new Date().getFullYear().toString() +
                                      "/" +
                                      (order || 1).toString().padStart(4, "0") +
                                      "/" +
                                      client.numero
                                  );
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
                  <span className="font-medium text-base">Ajouter un item</span>
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
              Cinq cent cinquante mille francs
            </span>
          </div>
          <div className="flex flex-col items-end">
            <div className="grid grid-cols-2 gap-2 justify-items-end">
              <span className="text-lg">Total HT :</span>
              <span className="text-lg">550 000</span>
              <span className="text-lg">Total Remises :</span>
              <span className="text-lg">0</span>
              <span className="text-lg">TVA 18% :</span>
              <span className="text-lg">99 000</span>
              <span className="text-lg">Total TTC :</span>
              <span className="text-lg">649 000</span>
            </div>
          </div>
        </div>

      </div>
      <div className="flex flex-col h-full w-2/6 text-xl border-l-2 ">
        <div className="flex flex-col p-3 bg-gray-200">
          <span>Parametres</span>
        </div>
      </div>
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
        <Input type="number" value={values.quantity} onChange={handleChange("quantity")} />
      </TableCell>
      <TableCell className="text-lg border border-black w-[180px]">
        <Input type="number" value={values.unitPrice} onChange={handleChange("unitPrice")} />
      </TableCell>
      <TableCell className="text-lg border border-black">
        <Input type="number" value={values.remise} onChange={handleChange("remise")} />
      </TableCell>
      <TableCell className="text-lg border border-black">
        <Input type="number" value={values.tva} onChange={handleChange("tva")} />
      </TableCell>
      <TableCell className="text-lg border border-black w-[180px]">
        <Input type="number" value={values.total} readOnly />
      </TableCell>
      <TableCell className="border-none">
        <Trash2 className="hover:text-red-700 cursor-pointer" onClick={() => removeItem && removeItem(values.reference)} />
      </TableCell>
    </TableRow>
  );
};
