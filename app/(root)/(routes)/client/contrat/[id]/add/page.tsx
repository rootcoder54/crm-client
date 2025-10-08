import AddContrat from "@/components/client/add-contrat";

interface pageProps {
  params: Promise<{ id: string }>;
}
const AddContratPage = async({ params }: pageProps) => {
    const { id } = await params;
    return <AddContrat clientId={id} />;
}
 
export default AddContratPage;