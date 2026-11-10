import { requirePermission } from "@/lib/permissions";
import ClotureRequete from "@/components/requete/cloture-requete";
import { getRequeteById } from "@/services/requete.service";
import { Requete } from "@prisma/client";

interface ClotureRequeteProps {
  params: Promise<{ id: string }>;
}
const ClotureRequetePage = async ({ params }: ClotureRequeteProps) => {
  await requirePermission("/requete", "update", "requete_cloture");
  const { id } = await params;
  const requete = (await getRequeteById(id)) as Requete;
  return (
    <div>
      <ClotureRequete requete={requete} />
    </div>
  );
};

export default ClotureRequetePage;
