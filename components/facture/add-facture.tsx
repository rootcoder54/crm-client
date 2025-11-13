"use client";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Client } from "@prisma/client";
import { createFacture, maxorder } from "@/services/facture.service";
import { toast } from "sonner";
import HeaderPage from "../features/header-page";
import Link from "next/link";
import { LoaderOne } from "../ui/loader";

const FactureSchema = z.object({
  numero: z.string(),
  date: z.date(),
  type: z.string().optional(),
  acquittee: z.boolean().optional(),
  modeReglement: z.string().optional(),
  devise: z.string().optional(),
  observation: z.string().optional(),
  totalHT: z.number(),
  remise: z.number().optional(),
  totalTTC: z.number(),
  totalTVA: z.number(),
  clientId: z.string(),
  numeroOrdre: z.number().optional()
});

export const AddFacturation = () => {
  const [isPending, startTransition] = useTransition();
  const [order, setorder] = useState<number>();

  const { data: clientList, isLoading } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => fetcher(`/api/client`)
  });

  const route = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await maxorder(); // si c’est une server action valide
      setorder(res);
    };

    fetchOrder();
  }, []);

  const form = useForm({
    resolver: zodResolver(FactureSchema),
    defaultValues: {
      numero: "",
      date: new Date(),
      type: "",
      acquittee: false,
      modeReglement: "Espèce",
      devise: "CFA",
      observation: "",
      totalHT: 0,
      remise: 0,
      totalTTC: 0,
      totalTVA: 0,
      clientId: "",
      numeroOrdre: order || 1
    }
  });

  function onSubmit(values: z.infer<typeof FactureSchema>) {
    startTransition(() => {
      createFacture(values).then(() => {
        toast.success("Facture ajoutée avec succès");
        route.push("/facture");
      });
    });
  }

  if (isPending) {
    return (
      <div className="w-full flex flex-row items-center justify-center">
        <LoaderOne />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <HeaderPage
            chemins={[
              { title: "Factures", url: "/facture" },
              { title: "Nouvelle Facture", url: "#" }
            ]}
          >
            <Button type="submit" variant={"blue"}>
              Suivant
            </Button>
            <Link href={"/facture"}>
              <Button variant={"destructive"}>Annuler</Button>
            </Link>
          </HeaderPage>
          <div className="space-y-4 px-5">
            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID de la fiche</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd")
                          ) : (
                            <span>choix une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numeroOrdre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° Ordre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modeReglement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode de règlement</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="reglement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Espèce">Espèce</SelectItem>
                      <SelectItem value="Chèque">Chèque</SelectItem>
                      <SelectItem value="Virement">Virement</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="devise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Devise</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="reglement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CFA">CFA</SelectItem>
                        <SelectItem value="EURO">EURO</SelectItem>
                        <SelectItem value="DOLLAR">DOLLAR</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observations</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Client</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? clientList?.find(
                                (client) => client.id === field.value
                              )?.nomClient
                            : "Selectionner le client"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
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
                                    form.setValue("clientId", client.id);
                                  }}
                                >
                                  {client.nomClient}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      client.id === field.value
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};
