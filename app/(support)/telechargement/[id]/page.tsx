import Image from "next/image";
import { notFound } from "next/navigation";
import { logiciels } from "@/constante/logiciels";
import SupportHero from "../../_components/SupportHero";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const logiciel = logiciels.find((item) => item.id === id);
  if (!logiciel) notFound();
  return (
    <>
      <SupportHero
        eyebrow="Téléchargement"
        title={`Installez ${logiciel.name}. Passez à l’action.`}
        description={logiciel.description || undefined}
        back={{ href: "/telechargement", label: "Tous les téléchargements" }}
      />
      <section className="ms-container ms-section ms-reading">
        <Image
          src={logiciel.image}
          alt={logiciel.name}
          width={180}
          height={100}
        />
        <dl className="ms-meta">
          <div>
            <dt>Version</dt>
            <dd>{logiciel.version}</dd>
          </div>
          <div>
            <dt>Date de publication</dt>
            <dd>{logiciel.date}</dd>
          </div>
          <div>
            <dt>Taille</dt>
            <dd>{logiciel.size || "Non précisée"}</dd>
          </div>
          <div>
            <dt>Installation</dt>
            <dd>Windows</dd>
          </div>
        </dl>
        {logiciel.telecharger ? (
          <a className="ms-button" href={logiciel.telecharger} download>
            Télécharger {logiciel.name} ↓
          </a>
        ) : (
          <p>Le téléchargement n’est pas disponible actuellement.</p>
        )}
        {logiciel.nouveaute && (
          <div className="ms-section">
            <h2>Les nouveautés</h2>
            {logiciel.nouveaute.map((item, i) => (
              <details className="ms-chapter p-6" key={i}>
                <summary className="cursor-pointer font-semibold">
                  {item.titre}
                </summary>
                <p className="mt-4">{item.description}</p>
              </details>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
