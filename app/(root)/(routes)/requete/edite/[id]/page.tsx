import { requirePermission } from "@/lib/permissions";
import EditeRequete from "@/components/requete/edite-requete";
import { getRequeteById } from "@/services/requete.service";
import { Requete } from "@prisma/client";

interface EditeRequeteProps {
  params: Promise<{ id: string }>;
}
const EditeRequetePage = async ({ params }: EditeRequeteProps) => {
  await requirePermission("/requete", "update", "requete_edite");
  const { id } = await params;
  const requete = (await getRequeteById(id)) as Requete;
  return (
    <div>
      <EditeRequete requete={requete} />
    </div>
  );
};

export default EditeRequetePage;
