"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Ban, Home, Save } from "lucide-react";

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
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Requete } from "@prisma/client";
import { updateRequete } from "@/services/requete.service";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Spinner } from "../spinner";

const EditeRequete = ({ requete }: { requete: Requete }) => {
  const router = useRouter();
  const [isPending, transition] = useTransition();
  const chemins = [
    { title: "Requête", url: "/requete" },
    { title: "Details", url: "#" }
  ];

  const schema = z.object({
    sujet: z.string(),
    description: z.string(),
    type: z.string(),
    observation: z.string(),
    logiciel: z.string(),
    demandeur: z.string(),
    technicien: z.string()
  });
  const ismobile = useIsMobile();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      sujet: requete.sujet,
      description: requete.description || "",
      type: requete.type || "",
      observation: requete.observation || "",
      logiciel: requete.logiciel || "",
      demandeur: requete.demandeur || "",
      technicien: requete.technicien || ""
    }
  });

  function onSubmit(values: z.infer<typeof schema>) {
    transition(() =>
      updateRequete(requete.id, values).then((data) => {
        toast.success(`Requete ${data.sujet} a été modifié avec succes`);
        router.push("/requete");
      })
    );
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
          <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
              <div className="flex items-center gap-2">
                {ismobile ? (
                  <>
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                      orientation="vertical"
                      className="mx-2 data-[orientation=vertical]:h-4"
                    />
                  </>
                ) : (
                  <>
                    <Link href={`http://localhost:3000`}>
                      <Home className="-ml-1" />
                    </Link>
                    <Separator
                      orientation="vertical"
                      className="mx-2 data-[orientation=vertical]:h-4"
                    />
                  </>
                )}
              </div>
              {chemins ? (
                chemins.map((chemin, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {chemin.url === "#" ? (
                      <h1>{chemin.title}</h1>
                    ) : (
                      <Link href={chemin.url}>
                        <h1 className="text-base font-medium">
                          {chemin.title}
                        </h1>
                      </Link>
                    )}
                    {index < chemins.length - 1 && (
                      <Separator
                        orientation="vertical"
                        className="mx-2 data-[orientation=vertical]:h-4"
                      />
                    )}
                  </div>
                ))
              ) : (
                <>
                  <h1 className="text-base font-medium">Test</h1>
                </>
              )}

              <div className="ml-auto flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Button variant={"default"} type="submit">
                    <Save />
                    Enregistrer
                  </Button>
                  <Link href={"/requete"}>
                    <Button variant={"destructive"}>
                      <Ban />
                      Annuler
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </header>
          <div className="space-y-8 px-12 pt-5">
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
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditeRequete;
