import { requirePermission } from "@/lib/permissions";
import DeleteRequete from "@/components/requete/delete-requete";
import { getRequeteById } from "@/services/requete.service";
import { Requete } from "@prisma/client";

interface DeleteRequeteProps {
  params: Promise<{ id: string }>;
}
const DeleteRequetePage = async ({ params }: DeleteRequeteProps) => {
  await requirePermission("/requete", "delete", "requete_delete");
  const { id } = await params;
  const requete = (await getRequeteById(id)) as Requete;
  return (
    <div>
      <DeleteRequete requete={requete} />
    </div>
  );
};

export default DeleteRequetePage;
