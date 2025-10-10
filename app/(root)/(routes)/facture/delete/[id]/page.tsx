import DeleteFacture from "@/components/facture/delete-facture";
import { getFactureById } from "@/services/facture.service";
import { Facture } from "@prisma/client";

interface pageProps {
  params: Promise<{ id: string }>;
}
const DeleteFacturePage = async ({ params }: pageProps) => {
  const { id } = await params;
  const facture = (await getFactureById(id)) as Facture;
  return (
    <div>
      <DeleteFacture facture={facture} />
    </div>
  );
};

export default DeleteFacturePage;
