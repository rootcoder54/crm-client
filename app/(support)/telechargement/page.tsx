import Image from "next/image";
import SupportHero from "../_components/SupportHero";
import { DownloadTab } from "../_components/download";
export default function Page() {
  return (
    <>
      <SupportHero
        eyebrow="Vos outils, à portée de main"
        title="Votre prochaine étape commence ici."
        description="Retrouvez RHPaie et ses versions disponibles pour installer ou mettre à jour votre solution de gestion de la paie."
      />
      <section className="ms-container ms-section">
        <div className="ms-download-panel">
          <Image src="/rhpaie.png" alt="RHPaie" width={100} height={100} />
          <div>
            <div className="ms-eyebrow">Logiciel de paie</div>
            <h2>RHPaie 15</h2>
            <p>Version 2715.246.202603.4 · Programme d’installation Windows</p>
            <a
              className="ms-button"
              href="https://malisystem.com/download/2715.246.202603.4.exe"
              download
            >
              Télécharger RHPaie 15 ↓
            </a>
          </div>
          <a
            className="ms-back"
            href="https://malisystem.com/fonctionnalite.php"
          >
            Découvrir RHPaie ↗
          </a>
        </div>
        <DownloadTab />
      </section>
    </>
  );
}
