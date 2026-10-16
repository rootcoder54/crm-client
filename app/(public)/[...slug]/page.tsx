import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Download, Layers3 } from "lucide-react";
import pages from "@/content/public-pages.json";
import { products } from "@/content/marketing";
import { ProductPage } from "@/components/marketing/product-page";
import { PricingPage } from "@/components/marketing/pricing-page";
import { TrainingPage } from "@/components/marketing/training-page";
import { PageIntro, ContactCTA } from "@/components/marketing/sections";
const documents: Record<string,{title:string;html:string}>=pages;
export const dynamicParams=false;
export function generateStaticParams(){return Object.keys(documents).map(path=>({slug:path.split("/")}));}
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params;const product=slug[0]==="logiciels"?products.find(p=>p.slug===slug[1]):undefined;return {title:product?`${product.name} — ${product.category}`:documents[slug.join("/")]?.title,description:product?.description};}
export default async function ContentPage({params}:{params:Promise<{slug:string[]}>}){
 const {slug}=await params;const page=documents[slug.join("/")];if(!page)notFound();
 if(slug[0]==="logiciels"){const product=products.find(p=>p.slug===slug[1]);if(!product)notFound();return <ProductPage product={product} legacy={page.html}/>}
 if(slug.join("/")==="tarifs/logiciels")return <PricingPage/>;
 if(slug.join("/")==="tarifs/formation")return <TrainingPage/>;
 const version=slug[1];
 return <><PageIntro eyebrow={`NOUVEAUTÉS RHPAIE ${version}`} title="Votre logiciel évolue avec vos besoins." text={`Découvrez les évolutions de RHPaie ${version}, classées par domaine. Ouvrez les explications pour comprendre les usages et consulter les exemples disponibles.`}><div className="ms-actions"><Link href="/difference" className="ms-button"><Layers3 size={18}/> Comparer les versions</Link><Link href="/telechargement" className="ms-button ms-button-ghost"><Download size={18}/> Téléchargements</Link></div></PageIntro><div className="ms-container ms-document"><nav aria-label="Versions de RHPaie" className="ms-tabs">{[15,14,13,12,11].map(v=><Link key={v} href={`/nouveautes/${v}`} aria-current={String(v)===version?"page":undefined}>RHPaie {v}{v===15&&<small>À découvrir</small>}</Link>)}</nav><div className="ms-news-layout"><aside><span className="ms-eyebrow">EXPLORER CETTE VERSION</span><h2>Les évolutions en détail.</h2><p>Personnel, calcul, éditions, sécurité : retrouvez les nouveautés publiées pour cette version.</p><Link className="ms-text-link" href="/contact">Une question ? <ArrowUpRight size={18}/></Link></aside><article className="ms-imported-content ms-release-content" dangerouslySetInnerHTML={{__html:page.html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/,"")}}/></div></div><ContactCTA/></>;
}
