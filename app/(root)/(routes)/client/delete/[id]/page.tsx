import DeleteClient from "@/components/client/delete-client";
import { getClientById } from "@/services/client.service";
import { Client } from "@prisma/client";

interface DeleteClientProps {
  params: Promise<{ id: string }>;
}
const DeleteClientPage = async ({ params }: DeleteClientProps) => {
  const { id } = await params;
  const client = (await getClientById(id)) as Client;
  return (
    <div>
      <DeleteClient client={client} />
    </div>
  );
};

export default DeleteClientPage;
