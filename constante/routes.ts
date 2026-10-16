/** Public pages and read-only endpoints used by the support centre. */
export const publicRoutes = [
  "/", "/logiciels", "/tarifs", "/nouveautes", "/difference", "/contact",
  "/devis", "/a-propos", "/support", "/formation", "/telechargement",
  "/api/video", "/api/article"
];
export const authRoutes = ["/admin/login", "/admin/logout"];
export const apiAuthPrefix = "/api/auth";
export const DEFAULT_LOGIN_REDIRECT = "/admin";
export const DEFAULT_LOGOUT_REDIRECT = "/admin/login";

/** Match whole path segments: '/' must never make every route public. */
export function matchesRoute(pathname: string, route: string) {
  return pathname === route || (route !== "/" && pathname.startsWith(`${route}/`));
}

export function isPublicRoute(pathname: string, method = "GET") {
  // Public support APIs expose reads only; future mutations stay authenticated.
  if (pathname.startsWith("/api/") && !["GET", "HEAD"].includes(method)) return false;
  return publicRoutes.some((route) => matchesRoute(pathname, route));
}
