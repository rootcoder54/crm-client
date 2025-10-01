import InterventionRequete from "@/components/requete/intervention-requete";
import { getInterventionById } from "@/services/intervention.service";
import { getRequeteById } from "@/services/requete.service";

interface InterventionRequeteProps {
  params: Promise<{ id: string }>;
}
const InterventionRequetePage = async ({
  params
}: InterventionRequeteProps) => {
  const { id } = await params;
  const requete = await getRequeteById(id);

  if (!requete) {
    return null;
  }

  if (requete.Intervention.length === 0) {
    return (
      <div>
        <InterventionRequete requete={requete} items={[]} />
      </div>
    );
  }

  const intervention = await getInterventionById(requete.Intervention[0].id);

  if (!intervention) {
    return null;
  }
  return (
    <div>
      <InterventionRequete requete={requete} items={intervention.items} />
    </div>
  );
};

export default InterventionRequetePage;
