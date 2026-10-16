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

// Protect every admin path (including IDs containing dots) and every API.
// Public pages and static files do not need a session lookup.
export const config = {
  matcher: ["/admin/:path*", "/api/:path*"]
};
