import DeleteIntervention from "@/components/intervention/delete-intervention";
import { getInterventionById } from "@/services/intervention.service";
import { getItemInterventionById } from "@/services/itemIntervention.service";
import { Intervention, ItemIntervention } from "@prisma/client";

interface DeleteRequeteProps {
  params: Promise<{ interventionId: string }>;
}
const DeleteInterventionPage = async ({ params }: DeleteRequeteProps) => {
  const { interventionId } = await params;

  const item = (await getItemInterventionById(
    interventionId
  )) as ItemIntervention;
  
  const intervention = (await getInterventionById(
    item.interventionId ?? ""
  )) as Intervention;

  return <DeleteIntervention intervention={intervention} item={item} />;
};

export default DeleteInterventionPage;
