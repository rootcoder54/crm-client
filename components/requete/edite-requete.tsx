"use client";

import { Ban, Save } from "lucide-react";

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
import HeaderPage from "../features/header-page";
import { LoaderOne } from "../ui/loader";

const EditeRequete = ({ requete }: { requete: Requete }) => {
  const router = useRouter();
  const [isPending, transition] = useTransition();

  const schema = z.object({
    sujet: z.string(),
    description: z.string(),
    type: z.string(),
    observation: z.string(),
    logiciel: z.string(),
    demandeur: z.string(),
    technicien: z.string()
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      sujet: requete.sujet || "",
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
        router.push("/requete/detail/" + requete.id);
      })
    );
  }

  const handleCancel = () => {
    router.back();
  };

  if (isPending) {
    return (
      <div className="h-24 flex items-center w-full justify-center text-center">
        <LoaderOne />
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
              { title: "Modifier", url: "#" }
            ]}
          >
            <div className="flex items-center gap-2">
              <Button variant={"default"} type="submit">
                <Save />
                Enregistrer
              </Button>
              <Button
                variant={"destructive"}
                type="button"
                onClick={handleCancel}
              >
                <Ban />
                Annuler
              </Button>
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
                    <Textarea {...field} className="h-[250px]" />
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
                    <Textarea {...field} className="h-[250px]" />
                  </FormControl>
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
