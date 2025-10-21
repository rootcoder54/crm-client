import EditeClient from "@/components/client/edite-client";
import { getClientById } from "@/services/client.service";
import { Client } from "@prisma/client";

interface EditeClientProps {
  params: Promise<{ id: string }>;
}
const EditeClientPage = async ({ params }: EditeClientProps) => {
  const { id } = await params;
  const client = (await getClientById(id)) as Client;
  return (
    <div>
      <EditeClient client={client} />
    </div>
  );
};

export default EditeClientPage;
