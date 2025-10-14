import DeleteBase from "@/components/client/delete-base";
import { getBaseById } from "@/services/base.service";
import { Base } from "@prisma/client";

interface DeleteBaseProps {
  params: Promise<{ baseId: string }>;
}
const DeleteBasePage = async ({ params }: DeleteBaseProps) => {
  const { baseId } = await params;
  const base = (await getBaseById(baseId)) as Base;
  return (
    <div>
      <DeleteBase base={base} />
    </div>
  );
};

export default DeleteBasePage;
