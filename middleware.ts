import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_LOGOUT_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  isPublicRoute,
  matchesRoute
} from "./constante/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  if (matchesRoute(pathname, apiAuthPrefix)) return;

  if (authRoutes.includes(pathname)) {
    if (isLoggedIn && pathname === DEFAULT_LOGOUT_REDIRECT) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute(pathname, req.method)) {
    if (matchesRoute(pathname, "/api")) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }
    return Response.redirect(new URL(DEFAULT_LOGOUT_REDIRECT, nextUrl));
  }
});

// Protect root-level CRM pages, print routes and APIs, including dotted IDs.
// Only Next.js internal assets bypass this check; public logos use an exact allowlist.
export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/webpack-hmr).*)"]
};
