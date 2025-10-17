"use client";

import Link from "next/link";
import { Ban, CalendarIcon, Check, ChevronsUpDown, Plus } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Client } from "@prisma/client";
import { createRequete } from "@/services/requete.service";
import HeaderPage from "../features/header-page";
import { Spinner } from "../ui/spinner";
import { lastVisite } from "@/services/client.service";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";

const AddRequete = () => {
  const router = useRouter();
  const [isPending, transition] = useTransition();
  const { isPending: isLoading, data: clients } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => fetcher(`/api/client`)
  });
  console.log(clients);

  const schema = z.object({
    sujet: z.string(),
    description: z.string(),
    type: z.string(),
    observation: z.string(),
    logiciel: z.string(),
    demandeur: z.string(),
    technicien: z.string(),
    dateDebut: z.date(),
    clientId: z.string().optional()
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      sujet: "",
      description: "",
      type: "",
      observation: "",
      logiciel: "",
      demandeur: "",
      technicien: "",
      dateDebut: new Date(),
      clientId: undefined
    }
  });

  function onSubmit(values: z.infer<typeof schema>) {
    transition(() => {
      createRequete(values).then((data) => {
        if (data.clientId) {
          lastVisite(data.clientId, data.dateDebut).then((result) => {
            console.log(result);
            toast.success(`Requête ${data.sujet} enregistrer avec succes`);
            router.push("/requete");
          });
        }
      });
    });
  }
  if (isPending) {
    return (
      <div className="h-24 flex items-center w-full justify-center text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <HeaderPage
            chemins={[
              { title: "Requête", url: "/requete" },
              { title: "Nouvelle Requête", url: "#" }
            ]}
          >
            <div className="flex items-center gap-2">
              <Button variant={"secondary"} type="submit">
                <Plus />
                Nouvelle Requête
              </Button>
              <Link href={"/requete"}>
                <Button variant={"destructive"}>
                  <Ban />
                  Annuler
                </Button>
              </Link>
            </div>
          </HeaderPage>
          <div className="space-y-8 px-12 py-5">
            <FormField
              control={form.control}
              name="sujet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sujet</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observation</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logiciel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logiciel</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="RHPaie">RHPaie</SelectItem>
                      <SelectItem value="TimeSheet">TimeSheet</SelectItem>
                      <SelectItem value="RHFacture">RHFacture</SelectItem>
                      <SelectItem value="RHData">RHData</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="demandeur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demandeur</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="technicien"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technicien</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateDebut"
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
                            ? clients?.find(
                                (client) => client.id === field.value
                              )?.nomClient
                            : "Selectionner le client"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Recherche client..." />
                        <CommandList>
                          <CommandEmpty>Pas de client.</CommandEmpty>
                          <CommandGroup>
                            {isLoading && <Spinner />}
                            {clients?.map((client) => (
                              <CommandItem
                                value={client.nomClient}
                                key={client.id}
                                onSelect={() => {
                                  form.setValue("clientId", client.id);
                                }}
                                className="cursor-pointer"
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

export default AddRequete;
