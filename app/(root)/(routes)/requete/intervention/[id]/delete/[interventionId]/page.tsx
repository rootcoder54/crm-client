import DeleteIntervention from "@/components/intervention/delete-intervention";
import { getInterventionById } from "@/services/intervention.service";
import { Intervention } from "@prisma/client";

interface DeleteRequeteProps {
  params: Promise<{ interventionId: string }>;
}
const DeleteInterventionPage = async ({ params }: DeleteRequeteProps) => {
  const { interventionId } = await params;
  const intervention = (await getInterventionById(
    interventionId
  )) as Intervention;
  return <DeleteIntervention intervention={intervention} />;
};

export default DeleteInterventionPage;
