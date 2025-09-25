import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1,{
    message:"UserName est obligatoire"
  }),
  password: z.string().min(1,{
    message:"Password est obligatoire"
  }),
});

