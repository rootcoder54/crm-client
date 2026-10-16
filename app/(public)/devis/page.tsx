import { EnquiryForm } from "@/components/marketing/enquiry-form";
export const metadata={title:"Demande de facture proforma"};
export default function QuotePage(){return <section className="ms-container ms-section"><span className="ms-eyebrow">UNE SOLUTION ADAPTÉE À VOTRE ENTREPRISE</span><h1>Demandez votre devis.</h1><p className="ms-intro">Choisissez vos logiciels, votre configuration et renseignez votre entreprise pour préparer une demande de facture proforma.</p><div style={{maxWidth:800,margin:"40px auto 0"}}><EnquiryForm quote/></div></section>}
