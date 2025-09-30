import EditeRequete from "@/components/requete/edite-requete";
import { getRequeteById } from "@/services/requete.service";
import { Requete } from "@prisma/client";

interface EditeRequeteProps {
  params: Promise<{ id: string }>;
}
const EditeRequetePage = async ({ params }: EditeRequeteProps) => {
  const { id } = await params;
  const requete = (await getRequeteById(id)) as Requete;
  return (
    <div>
      <EditeRequete requete={requete} />
    </div>
  );
};

export default EditeRequetePage;
