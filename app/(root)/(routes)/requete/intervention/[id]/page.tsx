import InterventionRequete from "@/components/requete/intervention-requete";
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
  return (
    <div>
      <InterventionRequete requete={requete} />
    </div>
  );
};

export default InterventionRequetePage;
