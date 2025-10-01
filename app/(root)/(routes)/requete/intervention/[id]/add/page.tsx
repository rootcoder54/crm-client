import { AddIntervention } from "@/components/intervention/add-intervention";
import { getRequeteById } from "@/services/requete.service";
import { Requete } from "@prisma/client";
interface InterventionRequeteProps {
  params: Promise<{ id: string }>;
}

const AddInterventionPage = async ({ params }: InterventionRequeteProps) => {
  const { id } = await params;
  const requete = (await getRequeteById(id)) as Requete;
  if (!requete) {
    return null;
  }
  return <AddIntervention requete={requete} />;
};

export default AddInterventionPage;
