"use client";

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
import { useSession } from "next-auth/react";
import { editer } from "@/action/auth/edite";
import { useState, useTransition } from "react";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { Spinner } from "../spinner";

const formSchema = z
  .object({
    id: z.string(),
    oldpassword: z.string().min(1, {
      message: "Obligatoire"
    }),
    password: z.string().min(8, {
      message: "8 caracteres Minimun"
    }),
    confirmPassword: z.string().min(8, {
      message: "8 caracteres Minimun"
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
  })
  .refine((data) => /[!@#$%^&*(),.?":{}|<>]/.test(data.password), {
    message: "Le mot de passe doit contenir au moins un caractère spécial",
    path: ["password"]
  })
  .refine((data) => /[A-Z]/.test(data.password), {
    message: "Le mot de passe doit contenir au moins une lettre majuscule",
    path: ["password"]
  });

export function EditeForm() {
  const { data: session } = useSession();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: session?.user.id,
      password: "",
      confirmPassword: "",
      oldpassword: ""
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      editer(values).then((data) => {
        if (data === "old") {
          setError("Ancien mot de passe incorrect");
        } else if (data) {
          setSuccess("Mot de passe changé avec succès");
        }
      });
    });
  }
  if (isPending) {
    return (
      <div className="w-full flex justify-center h-40">
        <Spinner size={"lg"} />
      </div>
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="oldpassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ancien Mot de passe :</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau Mot de passe :</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer mot de passe :</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSuccess message={success} />
        <FormError message={error} />
        <div className="w-full flex items-center justify-end">
          <Button variant={"secondary"} type="submit" size={"lg"}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
}
