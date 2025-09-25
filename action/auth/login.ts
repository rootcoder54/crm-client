"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/components/auth/shemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/constante/routes";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const valided = loginSchema.safeParse(values);
  if (!valided.success) {
    return { error: "Invalide" };
  }
  const { username, password } = valided.data;

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "UserName ou password incorrect!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }

};
