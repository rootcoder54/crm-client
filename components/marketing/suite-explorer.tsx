"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { products } from "@/content/marketing";
import { ProductVisual } from "./sections";
export function SuiteExplorer(){
 const [selected,setSelected]=useState(0);const product=products[selected];
 return <div className="ms-explorer"><div className="ms-product-selector" role="group" aria-label="Choisir un logiciel à découvrir">{products.map((p,i)=><button key={p.slug} type="button" aria-pressed={selected===i} onClick={()=>setSelected(i)}><Image src={p.image} alt="" width={32} height={32}/><span><strong>{p.name}</strong><small>{p.category}</small></span><ArrowUpRight size={17}/></button>)}</div><div className={`ms-explorer-panel ms-tone-${product.color}`}><div className="ms-explorer-copy"><span className="ms-eyebrow">{product.category}</span><h3>{product.headline}</h3><p>{product.description}</p><ul className="ms-check-list">{product.features.slice(0,3).map(f=><li key={f.title}><Check size={17}/>{f.title}</li>)}</ul><Link className="ms-text-link" href={`/logiciels/${product.slug}`}>Découvrir {product.name} <ArrowUpRight size={20}/></Link></div><ProductVisual product={product} compact/></div></div>;
}
