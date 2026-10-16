import { AddFactureItem } from "@/components/facture/add-facture-item";

interface pageProps {
  params: Promise<{ id: string }>;
}

const AddFactureItemPage = async (
  props: pageProps
) => {
  const { id } = await props.params;
  return <AddFactureItem factureId={id} />;
};

export default AddFactureItemPage;