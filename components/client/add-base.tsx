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
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import HeaderPage from "../features/header-page";
import { Spinner } from "../ui/spinner";
import { createBase } from "@/services/base.service";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

const AddBase = ({ clientId }: { clientId: string }) => {
  const router = useRouter();
  const [isPending, transition] = useTransition();

  const schema = z.object({
    societe: z.string(),
    chemin: z.string(),
    convention: z.string(),
    poste: z
      .number({
        required_error: "Le poste est obligatoire",
        invalid_type_error: "Le poste doit être un nombre"
      })
      .positive("Le nombre doit être positif")
      .or(
        z
          .string()
          .regex(/^\d+$/, "Veuillez entrer un nombre valide")
          .transform(Number)
      ),
    employe: z
      .number({
        required_error: "L'employé est obligatoire",
        invalid_type_error: "L'employé doit être un nombre"
      })
      .positive("Le nombre doit être positif")
      .or(
        z
          .string()
          .regex(/^\d+$/, "Veuillez entrer un nombre valide")
          .transform(Number)
      ),
    date: z.date(),
    commentaire: z.string(),
    clientId: z.string()
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      societe: "",
      chemin: "",
      convention: "",
      poste: 0,
      employe: 0,
      date: new Date(),
      commentaire: "",
      clientId: clientId
    }
  });

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
    transition(() => {
      createBase(values)
        .then(() => {
          toast.success("Base ajouté avec succès");
          router.push("/client/base/" + clientId);
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
              { title: "Nouveau Contact", url: "#" }
            ]}
          >
            <div className="flex items-center gap-2">
              <Button variant={"secondary"} type="submit">
                <Plus />
                Ajouter
              </Button>
              <Link href={"/client/base/" + clientId}>
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
              name="societe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Société</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="chemin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chemin</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="convention"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Convention</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="poste"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poste</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employé</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
                  <FormLabel>Date d&apos;achat</FormLabel>
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
              name="commentaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
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

export default AddBase;
