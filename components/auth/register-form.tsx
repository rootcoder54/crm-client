"use client";

import { Ban, Check } from "lucide-react";

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
import { useState, useTransition } from "react";
import HeaderPage from "../features/header-page";

import { LoaderOne } from "../ui/loader";
import bcrypt from "bcryptjs";
import { createUser, getUserByUserName } from "@/services/user.service";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

const AuthRegister = () => {
  const router = useRouter();
  const [isPending, transition] = useTransition();
  const [usernameError, setusernameError] = useState<string>();
  const [typePassword, setTypePassword] = useState<"password" | "text">(
    "password"
  );

  const schema = z
    .object({
      name: z.string().min(2, "Le nom est obligatoire"),
      username: z.string().min(2, "Le nom d'utilisateur est obligatoire"),
      password: z
        .string()
        .min(4, "Le mot de passe doit contenir au moins 6 caractères"),
      confirmPassword: z
        .string()
        .min(4, "La confirmation du mot de passe est obligatoire")
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

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: ""
    }
  });

  const handlerBack = () => {
    router.back();
  };
  
  const ckeckChange = () => {
    if (typePassword === "password") {
      setTypePassword("text");
    } else {
      setTypePassword("password");
    }
  };

  function onSubmit(values: z.input<typeof schema>) {
    transition(() => {
      console.log(values);
      getUserByUserName(values.username).then((existingUser) => {
        if (existingUser) {
          setusernameError("Le nom d'utilisateur existe déjà.");
        } else {
          bcrypt.hash(values.password, 10).then((hashedPassword) => {
            console.log("Hashed Password:", hashedPassword);
            const data = {
              name: values.name,
              username: values.username,
              password: hashedPassword,
              image: ""
            };
            createUser(data).then((result) => {
              toast.success("Utilisateur créé avec succès !");
              router.push("/register/" + result.id);
            });
          });
        }
      });
    });
  }
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
              { title: "User", url: "#" },
              { title: "Inscription User", url: "#" }
            ]}
          >
            <div className="flex items-center gap-2">
              <Button variant={"default"} type="submit">
                <Check />
                Enregister
              </Button>
              <Button
                type="button"
                onClick={handlerBack}
                variant={"destructive"}
              >
                <Ban />
                Annuler
              </Button>
            </div>
          </HeaderPage>
          <div className="space-y-8 px-12 py-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom Complet</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="nom" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>UserName</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="pseudo" />
                  </FormControl>
                  <FormMessage />
                  {usernameError && (
                    <p className="text-sm text-destructive">{usernameError}</p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type={typePassword} />
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
                  <FormLabel>Confirmer le Password</FormLabel>
                  <FormControl>
                    <Input {...field} type={typePassword} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
              <Checkbox
                id="toggle-2"
                onCheckedChange={ckeckChange}
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
              />
              <div className="grid gap-1.5 font-normal">
                <p className="text-sm leading-none font-medium">
                  Afficher le mot de passe
                </p>
                <p className="text-muted-foreground text-sm">
                    Cochez cette case pour afficher le mot de passe en clair.
                </p>
              </div>
            </Label>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AuthRegister;
