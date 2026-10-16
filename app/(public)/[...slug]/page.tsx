import { notFound } from "next/navigation";
import Link from "next/link";
import pages from "@/content/public-pages.json";
const documents: Record<string, {title:string; html:string}> = pages;
export const dynamicParams = false;
export function generateStaticParams() {return Object.keys(documents).map(path=>({slug:path.split("/")}));}
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}) {
  const {slug}=await params;return {title:documents[slug.join("/")]?.title};
}
export default async function ContentPage({params}:{params:Promise<{slug:string[]}>}) {
 const {slug}=await params; const page=documents[slug.join("/")];if(!page)notFound();
 return <div className="ms-container ms-document"><nav aria-label="Fil d’Ariane" className="ms-breadcrumb"><Link href="/">Accueil</Link><span>/</span><span>{page.title}</span></nav>
 {slug[0]==="nouveautes" && <nav aria-label="Versions de RHPaie" className="ms-tabs">{[15,14,13,12,11].map(v=><Link key={v} href={`/nouveautes/${v}`} aria-current={String(v)===slug[1]?"page":undefined}>RHPaie {v}</Link>)}<Link href="/difference">Comparer</Link></nav>}
 <article className="ms-imported-content" dangerouslySetInnerHTML={{__html:page.html}}/>
 <div className="ms-inline-cta"><h2>Besoin d’un accompagnement ?</h2><Link href="/devis" className="ms-button">Demander un devis →</Link></div></div>;
}
