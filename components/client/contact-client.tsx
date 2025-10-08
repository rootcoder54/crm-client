import { Contact } from "@prisma/client";
import { DataTable } from "../datatables";
import { Plus } from "lucide-react";

const ContactClient = ({
  contacts,
  clientId
}: {
  contacts: Contact[];
  clientId: string;
}) => {
  return (
    <DataTable
      action={[
        {
          label: "Nouveau Contact",
          icon: <Plus />,
          url: `/client/contact/${clientId}/add`,
          variantbtn: "secondary"
        }
      ]}
      chemins={[
        { title: "Clients", url: "/client" },
        { title: "Details", url: `/client/detail/${clientId}` },
        { title: "Contacts", url: "#" }
      ]}
      selectAction={[]}
      data={contacts}
      hideList={["clientId"]}
      searchId="nom"
      searchPlaceholder="Rechercher nom"
      notData="Aucun contact trouvé"
    />
  );
};

export default ContactClient;
