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
import FormError from "./form-error";
import { Spinner } from "@/components/ui/spinner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "../ui/input-group";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | undefined>("");

  const [typePassword, setTypePassword] = useState("password");

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
    if (typePassword === "password") {
      setTypePassword("text");
    } else {
      setTypePassword("password");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-md">
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
                        <Input
                          disabled={isPending}
                          placeholder="bfof@gmail.com"
                          {...field}
                        />
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
                        <InputGroup>
                          <InputGroupInput
                            disabled={isPending}
                            type={typePassword}
                            {...field}
                          />
                          <InputGroupAddon align={"inline-end"}>
                            <Button
                              type="button"
                              onClick={ckeckChange}
                              size={"sm"}
                              variant={"ghost"}
                            >
                              {typePassword === "password" ? (
                                <Eye />
                              ) : (
                                <EyeOff />
                              )}
                            </Button>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormError message={error} />
                <Button
                  type="submit"
                  disabled={isPending}
                  size={"lg"}
                  className="w-full"
                >
                  {isPending && <Spinner />}
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
      </Card>
    </div>
  );
}
