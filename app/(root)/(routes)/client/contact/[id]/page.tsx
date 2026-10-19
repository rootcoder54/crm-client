import ContactClient from "@/components/client/contact-client";
import { getClientById } from "@/services/client.service";

interface pageProps {
  params: Promise<{ id: string }>;
}
const PageContactClient = async ({ params }: pageProps) => {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client || client.contacts.length === 0) {
    return <ContactClient clientId={id} contacts={[]} />;
  }
  return <ContactClient contacts={client?.contacts} clientId={id} />;
};

export default PageContactClient;
