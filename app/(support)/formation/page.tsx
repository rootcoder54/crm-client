"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { toast } from "sonner";
import { formationLogin } from "../_components/loginFormation";
import HeroFormation from "../_components/HeroFormation";
import { ListFormation } from "./_component/formation";

const FormationPage = () => {
  const [etat, setEtat] = useState(false);

  const formSchema = z.object({
    nom: z.string().min(1, {
      message: "Le nom est obligatoire"
    }),
    email: z.string().email({
      message: "Email est obligatoire"
    }),
    profession: z.string().min(1, {
      message: "La profession est obligatoire"
    })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      email: "",
      profession: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.success(`${values.nom}`);
    Cookies.set("useremail", values.email, { expires: 300 });
    Cookies.set("usernom", values.nom, { expires: 300 });
    Cookies.set("userprofession", values.profession, { expires: 300 });
    setEtat(false);
    await formationLogin(
      values.nom,
      values.email,
      values.profession
    )
      .then((result) => {
        console.log(result, "resultat"); // "La promesse est résolue !"
      })
      .catch((error) => {
        console.error(error); // "La promesse est rejetée."
      });
  };
  const userEmail = Cookies.get("useremail");
  useEffect(() => {
    if (!userEmail) {
      setEtat(true);
    }
  }, [etat,userEmail]);

  return (
    <div>
      <HeroFormation />
      <ListFormation />
      <Drawer open={etat}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm py-8">
            <DrawerHeader>
              <DrawerTitle>Inscription</DrawerTitle>
              <DrawerDescription>
                Inscrivez pour voir la formation de RHPaie
              </DrawerDescription>
            </DrawerHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complete</FormLabel>
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
                        <Input
                          type="email"
                          placeholder="exemple@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profession et entreprise</FormLabel>
                      <FormControl>
                        <Input placeholder="Developpeur chez MaliSystem" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Inscrire
                </Button>
              </form>
            </Form>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default FormationPage;
