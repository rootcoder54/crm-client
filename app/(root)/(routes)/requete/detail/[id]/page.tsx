import DetailRequete from "@/components/requete/detail-requete";
import { getRequeteById } from "@/services/requete.service";
import { Requete } from "@prisma/client";

interface pageProps {
  params: Promise<{ id: string }>;
}
const DetailRequetePage = async ({ params }: pageProps) => {
  const { id } = await params;
  const requete = (await getRequeteById(id)) as Requete;
  return (
    <div>
      <DetailRequete requete={requete} />
    </div>
  );
};

export default DetailRequetePage;
