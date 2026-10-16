import type { NextConfig } from "next";

// Old PHP URLs stay usable after replacing the public site.
const publicRedirects: Record<string, string> = {
  "/index.php": "/",
  "/logiciels": "/#logiciels",
  "/tarifs": "/tarifs/logiciels",
  "/nouveautes": "/nouveautes/15",
  "/fonctionnalite.php": "/logiciels/rhpaie",
  "/TMS_Presentation.php": "/logiciels/timesheet",
  "/RhData_Presentation.php": "/logiciels/rhdata",
  "/FacturePaie_Presentation.php": "/logiciels/rhfacture",
  "/prixLogiciel.php": "/tarifs/logiciels",
  "/formation.php": "/tarifs/formation",
  "/contact.php": "/contact",
  "/catalogue.php": "/devis",
  "/difference.php": "/difference",
  "/login": "/admin/login",
  "/logout": "/admin/logout"
};
const adminSections = ["client", "draft", "employe", "facture", "formationuser", "frequents", "importation", "intervention", "licence", "register", "requete", "setting", "test", "userlog", "video", "imprime"];
const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...Object.entries(publicRedirects).map(([source,destination])=>({source,destination,permanent:true})),
      ...[11,12,13,14,15].map(v=>({source:`/RHP${v}_Nouveautes.php`,destination:`/nouveautes/${v}`,permanent:true})),
      ...adminSections.map(section=>({source:`/${section}/:path*`,destination:`/admin/${section}/:path*`,permanent:true}))
    ];
  }
};
export default nextConfig;
