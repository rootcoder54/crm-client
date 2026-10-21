import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CircleHelp,
  PlayCircle,
  FileText,
  Clock,
} from "lucide-react";
import SupportHero from "../_components/SupportHero";
const resources = [
  {
    title: "Manuel RHPaie",
    description:
      "Retrouvez les étapes pour gérer votre paie, vos congés et vos déclarations.",
    href: "https://malisystem.com/manual/RHPaie/index.html",
    icon: BookOpen,
    tag: "Documentation",
  },
  {
    title: "Manuel TimeSheet",
    description:
      "Prenez en main le pointage et le suivi des heures de vos équipes.",
    href: "https://malisystem.com/manual/TMS/index.html",
    icon: Clock,
    tag: "Documentation",
  },
  {
    title: "Calcul des taxes",
    description:
      "Consultez le guide de calcul des taxes et des retenues sur salaire.",
    href: "https://malisystem.com/assets/docs/taxe.pdf",
    icon: FileText,
    tag: "Guide PDF",
  },
  {
    title: "Vidéos pratiques",
    description:
      "Suivez nos démonstrations pour avancer, une manipulation à la fois.",
    href: "/support/astuce",
    icon: PlayCircle,
    tag: "Tutoriels",
  },
  {
    title: "Questions fréquentes",
    description:
      "Trouvez des réponses aux questions que vous rencontrez au quotidien.",
    href: "/support/question",
    icon: CircleHelp,
    tag: "Réponses utiles",
  },
];
export default function SupportPage() {
  return (
    <>
      <SupportHero
        eyebrow="À vos côtés, au quotidien"
        title="Les bonnes ressources. Au bon moment."
        description="Un guide, une réponse, une démonstration : tout pour tirer le meilleur de vos solutions Malisystem."
      />
      <section className="ms-container ms-section">
        <div className="ms-section-heading">
          <div className="ms-eyebrow">Centre d’aide</div>
          <h2>Comment pouvons-nous vous aider ?</h2>
        </div>
        <div className="ms-resource-grid">
          {resources.map(({ icon: Icon, ...r }) => (
            <Link
              key={r.href}
              href={r.href}
              className="ms-card"
              {...(r.href.startsWith("https")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <span className="ms-card-icon">
                <Icon size={26} />
              </span>
              <span className="ms-card-tag">{r.tag}</span>
              <h3>{r.title}</h3>
              <p>{r.description}</p>
              <span className="ms-card-link">
                Consulter{" "}
                {r.href.startsWith("https") ? <ArrowUpRight size={18} /> : "→"}
              </span>
            </Link>
          ))}
        </div>
        <div className="ms-contact-panel">
          <div>
            <h2>Besoin d’un accompagnement ?</h2>
            <p>Notre équipe vous aide à trouver la bonne solution.</p>
          </div>
          <a href="https://malisystem.com/contact.php" className="ms-button">
            Parlons-en →
          </a>
        </div>
      </section>
    </>
  );
}
