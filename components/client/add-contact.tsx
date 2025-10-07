"use client";

import Link from "next/link";
import { Ban, Plus } from "lucide-react";

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
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import HeaderPage from "../features/header-page";
import { Spinner } from "../ui/spinner";
import { createContact } from "@/services/contact.service";

const AddContact = ({ clientId }: { clientId: string }) => {
  const router = useRouter();
  const [isPending, transition] = useTransition();

  const schema = z.object({
    nom: z.string(),
    telephone: z.string(),
    email: z.string(),
    poste: z.string(),
    clientId: z.string()
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: "",
      telephone: "",
      email: "",
      poste: "",
      clientId: clientId
    }
  });

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
    transition(() => {
      createContact(values)
        .then(() => {
          toast.success("Contact ajouté avec succès");
          router.push("/client/contact/" + clientId);
        })
        .catch((erreur) => {
          toast.error("Une erreur est survenue"+erreur.message);
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
              <Link href={"/client/contact/" + clientId}>
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
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
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

export default AddContact;
