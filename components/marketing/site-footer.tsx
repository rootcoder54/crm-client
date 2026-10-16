import Link from "next/link";
export function SiteFooter() {
  return <footer className="ms-footer"><div className="ms-container ms-footer-grid">
    <div><h2>MALI<span>SYSTEM</span></h2><p>Des solutions de proximité pour la paie et les ressources humaines.</p><Link href="/a-propos">À propos de nous →</Link></div>
    <div><h3>Nos solutions</h3>{["RHPaie","TimeSheet","RHData","RHFacture"].map(x=><Link key={x} href={`/logiciels/${x.toLowerCase()}`}>{x}</Link>)}</div>
    <div><h3>Vous accompagner</h3><Link href="/tarifs/logiciels">Tarifs logiciels</Link><Link href="/tarifs/formation">Tarifs formation</Link><Link href="/formation">Formation en ligne</Link><Link href="/telechargement">Téléchargements</Link><Link href="/support">Centre d’aide</Link><Link href="/devis">Demander un devis</Link></div>
    <div><h3>Parlons de votre projet</h3><a href="mailto:email@malisystem.com">email@malisystem.com</a><a href="tel:+22366224057">+223 66 22 40 57</a><a href="tel:+22366475189">+223 66 47 51 89</a><p>Lafiabougou, zone du cimetière<br />Bamako, Mali</p></div>
  </div><div className="ms-container ms-copyright">© {new Date().getFullYear()} Mali System Génie Logiciel · Performance & Qualité<Link href="/admin">Espace administration ↗</Link></div></footer>;
}
