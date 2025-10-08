import ContratClient from "@/components/client/contrat-client";
import { getClientById } from "@/services/client.service";

interface pageProps {
  params: Promise<{ id: string }>;
}
const PageContratClient = async ({ params }: pageProps) => {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client || client.contrats.length === 0) {
    return <ContratClient clientId={id} contrats={[]} />;
  }
  return <ContratClient contrats={client?.contrats} clientId={id} />;
};

export default PageContratClient;
