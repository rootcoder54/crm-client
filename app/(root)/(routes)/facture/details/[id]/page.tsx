import { DetailFacture } from "@/components/facture/detail-facture";

interface pageProps {
  params: Promise<{ id: string }>;
}

const PageDetailsFacture = async ({ params }: pageProps) => {
  const { id } = await params;
  return <DetailFacture idFacture={id} />;
};
export default PageDetailsFacture;
