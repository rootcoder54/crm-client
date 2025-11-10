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
import { createVideo } from "@/services/video.service";

const AddVideo = () => {
  const router = useRouter();
  const [isPending, transition] = useTransition();

  const schema = z.object({
    nom: z.string(),
    description: z.string(),
    detail: z.string(),
    url: z.string()
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: "",
      description: "",
      detail: "",
      url: ""
    }
  });

  function onSubmit(values: z.infer<typeof schema>) {
    transition(() => {
      createVideo(values).then((data) => {
        toast.success(`Video ${data.nom} enregistrer avec succes`);
        router.push("/video");
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
              { title: "Videos", url: "/video" },
              { title: "Nouvelle Video", url: "#" }
            ]}
          >
            <div className="flex items-center gap-2">
              <Button variant={"secondary"} type="submit">
                <Plus />
                Nouvelle Video
              </Button>
              <Link href={"/video"}>
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
                  <FormLabel>Nom Video</FormLabel>
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
              name="detail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detail</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
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

export default AddVideo;
