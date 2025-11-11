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
import { Textarea } from "@/components/ui/textarea";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import HeaderPage from "../features/header-page";
import { Spinner } from "../ui/spinner";
import MyEditor from "../features/Editor";
import { createArticle } from "@/services/article.service";

const AddArticle = () => {
  const router = useRouter();
  const [isPending, transition] = useTransition();

  const schema = z.object({
    titre: z.string(),
    description: z.string(),
    contenu: z.string()
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      titre: "",
      description: "",
      contenu: ""
    }
  });

  function onSubmit(values: z.infer<typeof schema>) {
    transition(() => {
      createArticle(values).then((data) => {
        toast.success(`Article ${data.titre} enregistrer avec succes`);
        router.push("/frequents");
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
              { title: "Question Frequentes", url: "/frequents" },
              { title: "Nouvelle Article", url: "#" }
            ]}
          >
            <div className="flex items-center gap-2">
              <Button variant={"secondary"} type="submit">
                <Plus />
                Nouvelle Article
              </Button>
              <Link href={"/frequents"}>
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
              name="titre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de l&apos;article</FormLabel>
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
              name="contenu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu</FormLabel>
                  <FormControl>
                    <MyEditor value={field.value} onChange={field.onChange} />
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

export default AddArticle;
