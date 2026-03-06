"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Ban, Box, CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { LoaderOne } from "../ui/loader";
import { useQuery } from "@tanstack/react-query";
import { Client } from "@prisma/client";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";

export function AddLicence() {
  const router = useRouter();
  const { isPending: isLoading, data: clients } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => fetcher(`/api/client`)
  });

  const schema = z.object({
    dateDebut: z.date().optional(),
    dateFin: z.date().optional(),
    clientId: z.string().optional()
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      dateDebut: new Date(),
      dateFin: new Date(),
      clientId: undefined
    }
  });

  function onSubmit(values: z.infer<typeof schema>) {
    console.log("sfdfsfsdfsdf", values);
  }

  const back = () => {
    router.back();
  };

  return (
    <Dialog open={true}>
      <DialogTrigger />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent className="sm:max-w-sm " showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Generation de Licence RHPaie</DialogTitle>
              <DialogDescription>
                Veuillez remplir les champs suivants pour generer une licence
                RHPaie.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="dateDebut"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Debut</FormLabel>
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
                name="dateFin"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Fin</FormLabel>
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
                              {isLoading && (
                                <div className="flex flex-col items-center p-5">
                                  <LoaderOne />
                                </div>
                              )}
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={back}>
                <Ban />
                Annuler
              </Button>
              <Button type="submit">
                <Box />
                Generer
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
