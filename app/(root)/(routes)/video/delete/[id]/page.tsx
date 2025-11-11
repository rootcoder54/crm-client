import DeleteVideo from "@/components/video/delete-video";
import { getVideoById } from "@/services/video.service";
import { Video } from "@prisma/client";

interface pageProps {
  params: Promise<{ id: string }>;
}
const DeleteVideoPage = async ({ params }: pageProps) => {
  const { id } = await params;
  const video = (await getVideoById(id)) as Video;
  return (
    <div>
      <DeleteVideo video={video} />
    </div>
  );
};

export default DeleteVideoPage;
