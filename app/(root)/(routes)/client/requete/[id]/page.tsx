import { RequeteClient } from "@/components/client/requete-client";

interface pageProps {
  params: Promise<{ id: string }>;
}

const PageClientRequete = async ({ params }: pageProps) => {
  const { id } = await params;

  return <RequeteClient id={id} />;
};

export default PageClientRequete;
