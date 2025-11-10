import { getVideoById } from "@/services/video.service";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) return <div>Vidéo introuvable</div>;

  return (
    <div className="flex flex-col items-center gap-4 px-5 py-10">
      <iframe
        src={video.url}
        title={video.nom}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full sm:w-full md:w-[700px] lg:w-[950px] xl:w-[1150px] aspect-video rounded-md shadow-md"
      ></iframe>
      <div className="flex flex-col bg-zinc-100 border shadow-md rounded-md p-6 sm:w-full md:w-[700px] lg:w-[950px] xl:w-[1150px]">
        <h2 className="text-2xl font-semibold text-zinc-700">{video.nom}</h2>
        <div dangerouslySetInnerHTML={{ __html: video.detail || "" }} />
      </div>
    </div>
  );
};

export default Page;
