import DetailVideo from "@/components/video/detail-video";
import { getVideoById } from "@/services/video.service";
import { Video } from "@prisma/client";

interface pageProps {
  params: Promise<{ id: string }>;
}
const DetailVideoPage = async ({ params }: pageProps) => {
  const { id } = await params;
  const video = (await getVideoById(id)) as Video;
  return <DetailVideo video={video} />;
};

export default DetailVideoPage;
