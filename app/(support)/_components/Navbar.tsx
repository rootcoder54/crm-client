"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
const links = [
  { href: "/formation", label: "Formation" },
  { href: "/telechargement", label: "Téléchargements" },
  { href: "/support", label: "Centre d’aide" },
];
export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="ms-announcement">
        <div className="ms-container">
          <span>Votre partenaire paie & RH depuis 2006</span>
          <a href="https://malisystem.com/RHP15_Nouveautes.php">
            Découvrez RHPaie 15 →
          </a>
        </div>
      </div>
      <header className="ms-header">
        <div className="ms-container ms-header-inner">
          <a href="https://malisystem.com" className="ms-brand">
            <Image src="/msys.png" alt="" width={40} height={40} />
            <span>
              MALI<span>SYSTEM</span>
              <small>Génie logiciel</small>
            </span>
          </a>
          <button
            className="ms-menu-toggle"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="support-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            id="support-navigation"
            className={`ms-nav ${open ? "is-open" : ""}`}
            aria-label="Navigation principale"
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
          >
            <a href="https://malisystem.com">
              Notre site <ArrowUpRight size={14} />
            </a>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={path.startsWith(link.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a href="https://malisystem.com/contact.php" className="ms-button">
              Nous contacter <ArrowUpRight size={16} />
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
