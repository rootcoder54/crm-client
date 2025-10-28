"use client";

import Link from "next/link";
import { Ban, CalendarIcon, Plus } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import HeaderPage from "../features/header-page";
import { Spinner } from "../ui/spinner";
import { createContrat } from "@/services/contrat.service";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { useSession } from "next-auth/react";
import { createLog } from "@/services/log.service";

const AddContrat = ({ clientId }: { clientId: string }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, transition] = useTransition();

  const schema = z.object({
    dateDebut: z.date(),
    dateFin: z.date(),
    type: z.string(),
    reconduction: z.string(),
    clientId: z.string()
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      dateDebut: new Date(),
      dateFin: new Date(),
      type: "",
      reconduction: "",
      clientId: clientId
    }
  });

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
    transition(() => {
      createContrat(values)
        .then((data) => {
          createLog({
            action: "Ajout Contrat",
            details: `contrat ${data.type} a été crée`,
            userId: session?.user.id ?? ""
          }).then(() => {
            toast.success("Contrat ajouté avec succès");
            router.push("/client/contrat/" + clientId);
          });
        })
        .catch((erreur) => {
          toast.error("Une erreur est survenue" + erreur.message);
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
              { title: "Clients", url: "/client" },
              { title: "Nouveau Contrat", url: "#" }
            ]}
          >
            <div className="flex items-center gap-2">
              <Button variant={"secondary"} type="submit">
                <Plus />
                Ajouter
              </Button>
              <Link href={"/client/contrat/" + clientId}>
                <Button type="button" variant={"destructive"}>
                  <Ban />
                  Annuler
                </Button>
              </Link>
            </div>
          </HeaderPage>
          <div className="space-y-8 px-12 py-5">
            <FormField
              control={form.control}
              name="dateDebut"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de debut</FormLabel>
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
                  <FormLabel>Date de Fin</FormLabel>
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
              name="reconduction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reconduction Automatique</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionné option de reconduction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Oui">Oui</SelectItem>
                      <SelectItem value="Non">Non</SelectItem>
                    </SelectContent>
                  </Select>

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

export default AddContrat;
