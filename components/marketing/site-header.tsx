import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return <>
    <div className="ms-contactbar"><div className="ms-container"><a href="mailto:email@malisystem.com">email@malisystem.com</a><a href="tel:+22366224057">+223 66 22 40 57</a><span>Génie logiciel · Depuis 2006</span></div></div>
    <header className="ms-header"><div className="ms-container ms-header-inner">
      <Link href="/" className="ms-brand" aria-label="Mali System, accueil"><Image src="/msys.png" alt="" width={48} height={44} /><span>MALI<span>SYSTEM</span><small>Performance & qualité</small></span></Link>
      <nav aria-label="Navigation principale" className="ms-nav">
        <Link href="/">Accueil</Link>
        <details><summary>Logiciels</summary><div>{["RHPaie", "TimeSheet", "RHData", "RHFacture"].map(name => <Link key={name} href={`/logiciels/${name.toLowerCase()}`}>{name}</Link>)}</div></details>
        <details><summary>Tarifs</summary><div><Link href="/tarifs/logiciels">Logiciels</Link><Link href="/tarifs/formation">Formations</Link></div></details>
        <details><summary>Nouveautés</summary><div>{[15,14,13,12,11].map(v => <Link key={v} href={`/nouveautes/${v}`}>RHPaie {v}</Link>)}<Link href="/difference">Comparer les versions</Link></div></details>
        <Link href="/contact">Contact</Link><Link href="/support">Assistance</Link><Link href="/admin" className="ms-admin-link">Administration</Link>
      </nav><Link href="/devis" className="ms-button ms-header-cta">Demander un devis ↗</Link>
    </div></header>
  </>;
}
