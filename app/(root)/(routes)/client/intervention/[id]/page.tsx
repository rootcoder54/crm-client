import InterventionClient from "@/components/client/intervention-client";
import { getClientById } from "@/services/client.service";
import { getInterventionById } from "@/services/intervention.service";

interface pageProps {
  params: Promise<{ id: string }>;
}

const PageClientIntervention = async ({ params }: pageProps) => {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client || client.interventions.length === 0) {
    return <InterventionClient items={[]} />;
  }
  const intervention = await getInterventionById(client.interventions[0].id);

  if (!intervention || intervention.items.length === 0) {
    return <InterventionClient items={[]} />;
  }
  return <InterventionClient items={intervention?.items} />;
};

export default PageClientIntervention;
