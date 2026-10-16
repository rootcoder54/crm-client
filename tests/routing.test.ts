import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { DEFAULT_LOGIN_REDIRECT, DEFAULT_LOGOUT_REDIRECT, isPublicRoute, matchesRoute } from "../constante/routes";
import nextConfig from "../next.config";
import documents from "../content/public-pages.json";

test("the public root does not expose admin pages or private APIs",()=>{
 for(const path of ["/admin","/admin/client","/admin/imprime/intervention/example.png","/api/client","/api/search"]){assert.equal(isPublicRoute(path),false,path)}
 assert.equal(DEFAULT_LOGIN_REDIRECT,"/admin");assert.equal(DEFAULT_LOGOUT_REDIRECT,"/admin/login");
});
test("support pages and read-only resources remain available anonymously",()=>{
 for(const path of ["/","/logiciels/rhpaie","/tarifs/formation","/support/question/id","/formation","/telechargement/15","/api/article","/api/video"]){assert.equal(isPublicRoute(path),true,path)}
 assert.equal(isPublicRoute("/api/article","POST"),false);
});
test("public route prefixes stop at segment boundaries",()=>{
 for(const path of ["/support-private","/api/videographer","/api/articles","/formationuser"]){assert.equal(isPublicRoute(path),false,path)}
 assert.equal(matchesRoute("/api/authentication","/api/auth"),false);
});
test("old CRM and PHP links redirect to their new destinations",async()=>{
 const redirects=await nextConfig.redirects!();
 for(const [source,dest] of [["/client/:path*","/admin/client/:path*"],["/imprime/:path*","/admin/imprime/:path*"],["/fonctionnalite.php","/logiciels/rhpaie"],["/formation.php","/tarifs/formation"],["/RHP15_Nouveautes.php","/nouveautes/15"],["/login","/admin/login"]]){
  assert.equal(redirects.find(r=>r.source===source)?.destination,dest);
 }
});
test("imported pages have local images and no legacy executable markup",()=>{
 for(const [slug,doc] of Object.entries(documents)){
  assert.ok(doc.title,slug);assert.doesNotMatch(doc.html,/<(?:script|style|form|iframe)\b|\son\w+=|javascript:|data-bs-/i,slug);
  for(const match of doc.html.matchAll(/src="(\/website\/[^"]+)"/g)){assert.ok(existsSync(`public${match[1]}`),match[1])}
 }
});
test("CRM and print entrypoints exist only under admin",()=>{
 assert.ok(existsSync("app/admin/(crm)/(routes)/page.tsx"));assert.ok(existsSync("app/admin/imprime/intervention/[id]/page.tsx"));
 assert.equal(existsSync("app/(root)"),false);assert.equal(existsSync("app/imprime"),false);
 assert.match(readFileSync("components/sidebar/app-sidebar.tsx","utf8"),/url: "\/admin"/);
});
