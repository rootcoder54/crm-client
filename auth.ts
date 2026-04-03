import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById } from "./action/user/user";
import { prisma } from "./lib/db";

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,  // Permet de faire confiance aux hôtes configurés.
  callbacks: {
    async signIn({ user }) {
      const existingUser = await getUserById(user.id);
      if (!existingUser) {
        return false;
      }
      return true;
    },
    async session({ token, session }) {
      //console.log({ sessionToken: token, session });
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.username = token.username as string;
        session.user.password = token.password as string;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existinguser = await getUserById(token.sub);
      if (!existinguser) return token;
      token.username = existinguser.username;
      token.password = existinguser.password;
      //console.log({ token });
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
