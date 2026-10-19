import DraftRequete from "@/components/requete/draft-requete";
import { getRequeteByIdWithOutIntervention } from "@/services/requete.service";
import { Requete } from "@prisma/client";

interface RequeteProps {
  params: Promise<{ id: string }>;
}

const DetailDraft = async ({ params }: RequeteProps) => {
  const { id } = await params;
  const requete = (await getRequeteByIdWithOutIntervention(id)) as Requete;
  return <DraftRequete requeteDraft={requete} />;
};

export default DetailDraft;
