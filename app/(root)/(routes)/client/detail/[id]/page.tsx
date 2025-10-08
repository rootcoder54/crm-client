import DetailClient from "@/components/client/detail-client";
import { getClientById } from "@/services/client.service";

interface pageProps {
  params: Promise<{ id: string }>;
}

const DetailClientPage = async ({ params }: pageProps) => {
  const { id } = await params;
  const client = await getClientById(id);
  return <DetailClient client={client} />;
};

export default DetailClientPage;
