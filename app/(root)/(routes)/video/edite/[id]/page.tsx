import EditeVideo from "@/components/video/edite-video";
import { getVideoById } from "@/services/video.service";
import { Video } from "@prisma/client";

interface pageProps {
  params: Promise<{ id: string }>;
}
const EditeVideoPage = async ({ params }: pageProps) => {
  const { id } = await params;
  const video = (await getVideoById(id)) as Video;
  return (
    <div>
      <EditeVideo video={video} />
    </div>
  );
};

export default EditeVideoPage;
