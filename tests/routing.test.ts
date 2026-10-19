import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { DEFAULT_LOGIN_REDIRECT, DEFAULT_LOGOUT_REDIRECT, isPublicRoute, matchesRoute } from "../constante/routes";
import nextConfig from "../next.config";

test("CRM root, modules, print pages and private APIs require authentication", () => {
  for (const path of ["/", "/client", "/requete/detail/a.b", "/imprime/intervention/a.png", "/api/client", "/api/search", "/download/client.xlsx"]) assert.equal(isPublicRoute(path), false, path);
  assert.equal(DEFAULT_LOGIN_REDIRECT, "/");
  assert.equal(DEFAULT_LOGOUT_REDIRECT, "/login");
});
test("support stays public and public APIs expose reads only", () => {
  for (const path of ["/support", "/support/question/id", "/formation", "/telechargement/15", "/api/article", "/api/video", "/msys.png"]) assert.equal(isPublicRoute(path), true, path);
  assert.equal(isPublicRoute("/formation", "POST"), true);
  assert.equal(isPublicRoute("/api/article", "POST"), false);
  assert.equal(isPublicRoute("/api/video", "DELETE"), false);
});
test("public prefixes and assets match exact boundaries", () => {
  for (const path of ["/support-private", "/api/videographer", "/api/articles", "/formationuser", "/msys.png/private"]) assert.equal(isPublicRoute(path), false, path);
  assert.equal(matchesRoute("/api/authentication", "/api/auth"), false);
});
test("old admin links redirect to root and marketing links to the separate domain", async () => {
  const redirects = await nextConfig.redirects!();
  assert.equal(redirects.find(r => r.source === "/admin")?.destination, "/");
  assert.equal(redirects.find(r => r.source === "/admin/:path*")?.destination, "/:path*");
  assert.equal(redirects.find(r => r.source === "/logiciels/:path*")?.destination, "https://malisystem.com/logiciels/:path*");
  assert.equal(redirects.find(r => r.source === "/contact")?.destination, "https://malisystem.com/contact");
});
test("CRM and login are root routes and no public website remains in Next.js", () => {
  for (const path of ["app/(root)/(routes)/page.tsx", "app/(auth)/login/page.tsx", "app/imprime/intervention/[id]/page.tsx"]) assert.ok(existsSync(path), path);
  for (const path of ["app/admin", "app/(public)", "components/marketing"]) assert.equal(existsSync(path), false, path);
  assert.match(readFileSync("components/sidebar/app-sidebar.tsx", "utf8"), /url: "\/"/);
});
test("middleware covers root routes and does not exclude file-like CRM identifiers", () => {
  const middleware = readFileSync("middleware.ts", "utf8");
  assert.match(middleware, /_next\/static/);
  assert.doesNotMatch(middleware, /matcher: \["\/admin/);
  assert.equal(isPublicRoute("/imprime/intervention/example.png"), false);
});
