import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import "@/styles/marketing.css";
export default function SupportLayout({children}:{children:React.ReactNode}) {
 return <div className="ms-site"><a className="ms-skip" href="#contenu">Aller au contenu</a><SiteHeader/><main id="contenu" className="min-h-screen flex flex-col items-center gap-y-4">{children}</main><SiteFooter/></div>;
}
