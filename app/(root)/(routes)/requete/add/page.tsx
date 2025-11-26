import AddRequete from "@/components/requete/add-requete";

const AddRequetePage = async () => {
  const id = crypto.randomUUID();
  return <AddRequete id={id} />;
};

export default AddRequetePage;
