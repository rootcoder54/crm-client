import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import Navbar from "./_components/Navbar";
import "./support.css";
export const metadata: Metadata = { title: { default: "Centre de ressources | Malisystem", template: "%s | Malisystem" }, description: "Guides, vidéos, formations et téléchargements pour vos solutions Malisystem." };

export default function SupportLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ms-support">
      <a href="#support-content" className="ms-skip">
        Aller au contenu
      </a>
      <Navbar />
      <main id="support-content">{children}</main>
      <footer className="ms-footer">
        <div className="ms-container ms-footer-grid">
          <div>
            <a className="ms-brand" href="https://malisystem.com">
              MALI<span>SYSTEM</span>
            </a>
            <p>
              La paie. Les ressources humaines.
              <br />
              Et un partenaire à vos côtés.
            </p>
          </div>
          <div>
            <h3>Vos ressources</h3>
            <Link href="/support">Centre d’aide</Link>
            <Link href="/formation">Formation en ligne</Link>
            <Link href="/telechargement">Téléchargements</Link>
          </div>
          <div>
            <h3>Parlons de votre projet</h3>
            <a href="mailto:email@malisystem.com">email@malisystem.com</a>
            <a href="tel:+22366224057">+223 66 22 40 57</a>
            <p>
              Lafiabougou, zone du cimetière
              <br />
              Bamako, Mali
            </p>
          </div>
        </div>
        <div className="ms-container ms-footer-bottom">
          <span>© {new Date().getFullYear()} Mali System Génie Logiciel</span>
          <Link href="/">Espace administration →</Link>
        </div>
      </footer>
    </div>
  );
}
