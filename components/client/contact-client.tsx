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
          url: `/admin/client/contact/${clientId}/add`,
          variantbtn: "secondary"
        }
      ]}
      chemins={[
        { title: "Clients", url: "/admin/client" },
        { title: "Details", url: `/admin/client/detail/${clientId}` },
        { title: "Contacts", url: "#" }
      ]}
      selectAction={[]}
      data={contacts}
      hideList={["clientId"]}
      searchId="nom"
      searchPlaceholder="Rechercher nom"
      notData="Aucun contact trouvé"
      storageKey="contact-datatable"
    />
  );
};

export default ContactClient;
