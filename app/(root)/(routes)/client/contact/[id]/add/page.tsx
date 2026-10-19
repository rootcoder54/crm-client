import AddContact from "@/components/client/add-contact";

interface pageProps {
  params: Promise<{ id: string }>;
}
const AddContactPage = async({ params }: pageProps) => {
    const { id } = await params;
    return <AddContact clientId={id} />;
}
 
export default AddContactPage;