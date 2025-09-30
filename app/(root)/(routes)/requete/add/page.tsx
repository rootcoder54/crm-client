import AddRequete from "@/components/requete/add-requete";
import { getAllClients } from "@/services/client.service";

const AddRequetePage = async () => {
  const clients = await getAllClients();
  return <AddRequete clients={clients} />;
};

export default AddRequetePage;
