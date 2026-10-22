import { Contact } from "@prisma/client";
import { DataTable } from "../datatables";
import { Plus } from "lucide-react";

const ContactClient = ({
  contacts,
  clientId,
}: {
  contacts: Contact[];
  clientId: string;
}) => {
  return (
    <DataTable
      emptyState={{
        icon: "contacts",
        title: "Aucun contact pour ce client",
        description:
          "Ajoutez un interlocuteur pour retrouver facilement son nom et ses coordonnées.",
        action: {
          label: "Ajouter un contact",
          href: `/client/contact/${clientId}/add`,
        },
      }}
      action={[
        {
          label: "Nouveau Contact",
          icon: <Plus />,
          url: `/client/contact/${clientId}/add`,
          variantbtn: "secondary",
        },
      ]}
      chemins={[
        { title: "Clients", url: "/client" },
        { title: "Details", url: `/client/detail/${clientId}` },
        { title: "Contacts", url: "#" },
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
