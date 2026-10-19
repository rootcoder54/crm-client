import DetailClient from "@/components/client/detail-client";
import { getClientById } from "@/services/client.service";
import { getRequetesByClient } from "@/services/requete.service";

interface pageProps {
  params: Promise<{ id: string }>;
}

const DetailClientPage = async ({ params }: pageProps) => {
  const { id } = await params;
  const client = await getClientById(id);
  const requetes = await getRequetesByClient(client?.id || "");
  return <DetailClient client={client} requetes={requetes} />;
};

export default DetailClientPage;
