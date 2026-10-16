import DeleteDraftRequete from "@/components/requete/delete-draft";
import { getRequeteById } from "@/services/requete.service";
import { Requete } from "@prisma/client";

interface DeleteRequeteProps {
  params: Promise<{ id: string }>;
}
const DeleteRequeteDraftPage = async ({ params }: DeleteRequeteProps) => {
  const { id } = await params;
  const requete = (await getRequeteById(id)) as Requete;
  return (
    <div>
      <DeleteDraftRequete requete={requete} />
    </div>
  );
};

export default DeleteRequeteDraftPage;
