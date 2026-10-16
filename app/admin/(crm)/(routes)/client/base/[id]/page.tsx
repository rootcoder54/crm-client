import BaseClient from "@/components/client/base-client";
import { getClientById } from "@/services/client.service";

interface pageProps {
  params: Promise<{ id: string }>;
}
const PageBaseClient = async ({ params }: pageProps) => {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client || client.bases.length === 0) {
    return <BaseClient clientId={id} bases={[]} />;
  }
  return <BaseClient bases={client?.bases} clientId={id} />;
};

export default PageBaseClient;
