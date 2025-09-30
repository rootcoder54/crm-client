import DeleteRequete from "@/components/requete/delete-requete";
import { getRequeteById } from "@/services/requete.service";
import { Requete } from "@prisma/client";

interface DeleteRequeteProps {
  params: Promise<{ id: string }>;
}
const DeleteRequetePage = async ({ params }: DeleteRequeteProps) => {
  const { id } = await params;
  const requete = (await getRequeteById(id)) as Requete;
  return (
    <div>
      <DeleteRequete requete={requete} />
    </div>
  );
};

export default DeleteRequetePage;
