import Writor from "@/components/features/Writor";
import { getArticleById } from "@/services/article.service";
import { notFound } from "next/navigation";
import SupportHero from "../../../_components/SupportHero";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();
  return (
    <>
      <SupportHero
        eyebrow="Questions fréquentes"
        title={article.titre}
        description={article.description ?? undefined}
        back={{ href: "/support/question", label: "Toutes les questions" }}
      />
      <section className="ms-container ms-section ms-reading">
        <article className="ms-article">
          <Writor value={article.contenu || ""} />
        </article>
      </section>
    </>
  );
}
