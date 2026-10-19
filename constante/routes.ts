/** Public resources of the separate support portal. The CRM root is private. */
export const publicRoutes = ["/support", "/formation", "/telechargement", "/api/video", "/api/article"];
export const authRoutes = ["/login", "/logout"];
export const apiAuthPrefix = "/api/auth";
export const DEFAULT_LOGIN_REDIRECT = "/";
export const DEFAULT_LOGOUT_REDIRECT = "/login";
const publicAssets = ["/msys.png", "/rhpaie.png", "/timesheet.png", "/rhdata.png", "/rhfacture.png", "/astuce.png", "/question.png", "/taxe.png", "/error.png", "/favicon.ico", "/next.svg", "/window.svg", "/file.svg", "/globe.svg", "/vercel.svg"];
export function matchesRoute(pathname: string, route: string) {
  return pathname === route || (route !== "/" && pathname.startsWith(`${route}/`));
}
export function isPublicRoute(pathname: string, method = "GET") {
  if (pathname.startsWith("/api/") && !["GET", "HEAD"].includes(method)) return false;
  return (["GET", "HEAD"].includes(method) && publicAssets.includes(pathname)) || publicRoutes.some(route => matchesRoute(pathname, route));
}
