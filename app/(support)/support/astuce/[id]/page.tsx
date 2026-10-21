import Writor from "@/components/features/Writor";
import { getVideoById } from "@/services/video.service";
import { notFound } from "next/navigation";
import SupportHero from "../../../_components/SupportHero";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await getVideoById(id);
  if (!video) notFound();
  return (
    <>
      <SupportHero
        eyebrow="Vidéo pratique"
        title={video.nom}
        description={video.description ?? undefined}
        back={{ href: "/support/astuce", label: "Toutes les vidéos" }}
      />
      <section className="ms-container ms-section ms-reading">
        <iframe
          src={video.url}
          title={video.nom}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="ms-video"
        />
        <article className="ms-article">
          <Writor value={video.detail || ""} />
        </article>
      </section>
    </>
  );
}
