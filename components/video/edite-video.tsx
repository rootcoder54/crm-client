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
import { updateVideo } from "@/services/video.service";
import MyEditor from "../features/Editor";
import { LoaderOne } from "../ui/loader";
import { Video } from "@prisma/client";

const EditeVideo = ({ video }: { video: Video }) => {
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
      nom: video.nom || "",
      description: video.description || "",
      detail: video.detail || "",
      url: video.url || ""
    }
  });

  function onSubmit(values: z.infer<typeof schema>) {
    transition(() => {
      updateVideo(video.id, values).then((data) => {
        toast.success(`Video ${data.nom} modifié avec succes`);
        router.push("/video");
      });
    });
  }
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center w-full justify-center text-center">
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
              { title: "Videos", url: "/video" },
              { title: "Editer Video", url: "#" }
            ]}
          >
            <div className="flex items-center gap-2">
              <Button variant={"secondary"} type="submit">
                <Plus />
                Editer Video
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
                    <MyEditor value={field.value} onChange={field.onChange} />
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

export default EditeVideo;
