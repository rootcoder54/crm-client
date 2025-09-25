"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/action/auth/logout";
import { useTransition } from "react";
import { Spinner } from "../spinner";
import { useRouter } from "next/navigation";

const LogoutForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const submit = () => {
    startTransition(() => {
      logout();
    });
  };
  const back = () => {
    router.back();
  };
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="shadow-md">
        {isPending && (
          <CardHeader className="text-center flex flex-col items-center justify-center p-9">
            <CardTitle className="text-xl">Deconnexion</CardTitle>
            <Spinner size={"lg"} />
          </CardHeader>
        )}
        {!isPending && (
          <div>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                🔐Voulez-vous vous deconnectez ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={submit} className="flex gap-x-2">
                <Button type="submit" size={"lg"} variant={"ghost"}>
                  <LogOut />
                  Deconnecter
                </Button>
                <Button type="button" variant={"destructive"} onClick={back}>
                  Annuler
                </Button>
              </form>
            </CardContent>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LogoutForm;
