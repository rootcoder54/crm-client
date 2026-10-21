"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Article, Video } from "@prisma/client";
import Link from "next/link";
import { Search, X, PlayCircle, CircleHelp } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import SupportHero from "./SupportHero";
export default function ResourceList({
  kind,
}: {
  kind: "articles" | "videos";
}) {
  const video = kind === "videos";
  const [search, setSearch] = useState("");
  const { data, isPending, isError, refetch } = useQuery<Article[] | Video[]>({
    queryKey: [kind],
    queryFn: () => fetcher(video ? "/api/video" : "/api/article"),
  });
  const entries = (data ?? []).map((item) =>
    "titre" in item
      ? {
          id: item.id,
          title: item.titre,
          description: item.description,
          content: item.contenu,
        }
      : {
          id: item.id,
          title: item.nom,
          description: item.description,
          content: item.detail,
        },
  );
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const filtered = entries.filter((item) =>
    normalize(
      `${item.title} ${item.description ?? ""} ${item.content ?? ""}`,
    ).includes(normalize(search.trim())),
  );
  const Icon = video ? PlayCircle : CircleHelp;
  return (
    <>
      <SupportHero
        eyebrow={
          video ? "Apprendre par la pratique" : "Les réponses à vos questions"
        }
        title={
          video
            ? "Un geste simple. Un pas de plus."
            : "Avancez avec les bonnes réponses."
        }
        description={
          video
            ? "Découvrez nos vidéos pour prendre en main vos outils et gagner en autonomie."
            : "Explorez les questions fréquentes sur nos solutions de paie et de ressources humaines."
        }
        back={{ href: "/support", label: "Centre d’aide" }}
      />
      <section className="ms-container ms-section">
        <div className="ms-list-toolbar">
          <h2>{video ? "Vidéos pratiques" : "Questions fréquentes"}</h2>
          <div className="ms-search">
            <Search size={20} />
            <input
              aria-label={
                video ? "Rechercher une vidéo" : "Rechercher une question"
              }
              placeholder="Rechercher une ressource…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                aria-label="Effacer la recherche"
                onClick={() => setSearch("")}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        {isPending ? (
          <div className="ms-empty" role="status">
            Chargement des ressources…
          </div>
        ) : isError ? (
          <div className="ms-empty" role="alert">
            <h3>Les ressources n’ont pas pu être chargées.</h3>
            <button className="ms-button" onClick={() => refetch()}>
              Réessayer
            </button>
          </div>
        ) : (
          <>
            <p className="ms-results" aria-live="polite">
              {filtered.length} ressource{filtered.length > 1 ? "s" : ""}
            </p>
            <div className="ms-resource-grid">
              {filtered.map((item) => (
                <Link
                  href={`/support/${video ? "astuce" : "question"}/${item.id}`}
                  className="ms-card"
                  key={item.id}
                >
                  <span className="ms-card-icon">
                    <Icon size={26} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="ms-card-link">
                    {video ? "Voir la vidéo" : "Lire la réponse"} →
                  </span>
                </Link>
              ))}
            </div>
            {!filtered.length && (
              <div className="ms-empty">
                <Icon size={32} />
                <h3>
                  {search
                    ? "Aucun résultat pour cette recherche"
                    : "Les ressources arrivent bientôt"}
                </h3>
                <p>
                  {search
                    ? "Essayez un autre mot-clé ou effacez votre recherche."
                    : "Revenez prochainement ou contactez notre équipe."}
                </p>
                {search && (
                  <button
                    className="ms-button ms-button-ghost"
                    onClick={() => setSearch("")}
                  >
                    Effacer la recherche
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
