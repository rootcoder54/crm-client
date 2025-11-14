import { Video } from "@prisma/client";
import HeaderPage from "../features/header-page";
import Writor from "../features/Writor";
import Link from "next/link";
import { Button } from "../ui/button";
import { SquarePen, Trash2 } from "lucide-react";

const DetailVideo = ({ video }: { video: Video }) => {
  return (
    <div>
      <HeaderPage
        chemins={[
          { title: "Videos", url: "/video" },
          { title: "Details Video", url: "#" }
        ]}
      >
        <Link href={`/video/edite/${video.id}`}>
          <Button variant={"outline"}>
            <SquarePen /> Editer
          </Button>
        </Link>
        <Link href={`/video/delete/${video.id}`}>
          <Button variant={"danger"}>
            <Trash2 /> Supprimer
          </Button>
        </Link>
      </HeaderPage>
      <div className="flex flex-col items-center gap-4 px-5 py-10">
        <iframe
          src={video.url}
          title={video.nom}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full sm:w-full md:w-[700px] lg:w-[950px] xl:w-[1150px] aspect-video rounded-md shadow-md"
        ></iframe>
        <div className="flex flex-col border shadow-md rounded-md p-6 sm:w-full md:w-[700px] lg:w-[950px] xl:w-[1150px]">
          <h2 className="text-2xl font-semibold">{video.nom}</h2>
          <Writor value={video.detail || ""} />
        </div>
      </div>
    </div>
  );
};
export default DetailVideo;
