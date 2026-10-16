import AddBase from "@/components/client/add-base";

interface pageProps {
  params: Promise<{ id: string }>;
}
const AddBasePage = async({ params }: pageProps) => {
    const { id } = await params;
    return <AddBase clientId={id} />;
}
 
export default AddBasePage;