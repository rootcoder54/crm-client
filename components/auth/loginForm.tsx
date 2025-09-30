"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { loginSchema } from "./shemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "@/action/auth/login";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Spinner } from "../spinner";
import FormError from "./form-error";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | undefined>("");

  const [typePassword, setTypePassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    setError("");
    startTransition(() => {
      login(values).then((data) => {
        if (data !== undefined) {
          setError(data.error);
        }
      });
    });
  }

  const ckeckChange = () => {
    setShowPassword((s) => !s);
    if (typePassword === "password") {
      setTypePassword("text");
    } else {
      setTypePassword("password");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-md">
        {isPending && (
          <CardHeader className="text-center flex flex-col items-center justify-center p-9">
            <CardTitle className="text-xl">Connexion</CardTitle>
            <Spinner />
          </CardHeader>
        )}
        {!isPending && (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                🔐 Bienvenue Sur Admin Malisystem
              </CardTitle>
              <CardDescription>
                Connectez-vous pour avoir accès au BackOffice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="bfof@gmail.com" {...field} />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type={typePassword} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!isPending && (
                    <div className="flex items-center justify-center gap-x-3">
                      <Checkbox
                        id="check"
                        checked={showPassword}
                        onCheckedChange={ckeckChange}
                      />
                      <label htmlFor="check">Afficher le mot de passe</label>
                    </div>
                  )}
                  <FormError message={error} />
                  <Button type="submit" size={"lg"} className="w-full">
                    <span>Se connecter</span>
                  </Button>
                </form>
              </Form>
              <div className="flex items-center justify-center py-4">
                Aller sur le
                <a href={"/support"}>
                  <Button variant={"link"}>Support</Button>
                </a>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
