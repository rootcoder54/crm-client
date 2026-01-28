"use client";

import { AlignVerticalJustifyEnd } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoVideocamOff } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { TracingBeam } from "@/components/ui/tracing-beam";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group";
import { fetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import { Video } from "@prisma/client";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

const AstucePage = () => {
  const [search, setSearch] = useState("");
  const {
    isError,
    isPending,
    data: videos
  } = useQuery<Video[]>({
    queryKey: ["videos"],
    queryFn: () => fetcher(`/api/video`)
  });
  if (isPending) {
    return (
      <div className="h-24 flex items-center w-full justify-center text-center">
        <Spinner className="size-8" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="m-4">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle> Erreur de donnée </AlertTitle>
          <AlertDescription>
            <p>Une erreur est survenue lors du chargement des Videos.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  // Filtrage par nom ou description
  const filteredVideos = videos.filter(
    (video) =>
      video.nom.toLowerCase().includes(search.toLowerCase()) ||
      video.description.toLowerCase().includes(search.toLowerCase()) ||
      video?.detail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <TracingBeam className="px-6">
      <div className="w-full flex flex-col gap-6 py-10">
        <h1 className="text-3xl font-bold text-neutral-600">
          Vidéos pratiques
        </h1>
        <InputGroup>
          <InputGroupInput
            placeholder="Recherche..."
            className="border-0 text-blue-700 placeholder:text-zinc-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <BiSearchAlt2 className="h-7 w-7 text-blue-700" />
          </InputGroupAddon>
          {search && (
            <InputGroupAddon align="inline-end">
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full hover:bg-zinc-200"
                onClick={() => setSearch("")}
              >
                <IoMdClose className="h-5 w-5 text-zinc-500" />
              </Button>
            </InputGroupAddon>
          )}
        </InputGroup>
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video, index) => (
            <CardVideo
              key={index}
              nom={video.nom}
              description={video.description}
              link={`/support/astuce/${video.id}`}
            />
          ))
        ) : (
          <div className="text-zinc-400 border rounded-md text-center p-5 border-blue-300 bg-blue-400/10 shadow flex flex-col items-center gap-2">
            <IoVideocamOff className="h-12 w-12 text-blue-500" />
            <span className="text-blue-500 text-lg">
              Aucune vidéo trouvée pour &quot;{search}&quot;
            </span>
          </div>
        )}
      </div>{" "}
    </TracingBeam>
  );
};

export default AstucePage;

const CardVideo = ({
  link,
  nom,
  description
}: {
  link: string;
  nom: string;
  description: string;
}) => {
  const texte = description.length > 100 ? description.slice(0, 100) + "..." : description;
  return (
    <Link
      href={link}
      className="rounded-md shadow p-4 flex gap-4 hover:bg-blue-400/10 group hover:border-blue-300 border"
    >
      <div className="flex-1">
        <div className="flex flex-row items-center gap-3">
          <AlignVerticalJustifyEnd className="w-14 group-hover:text-blue-500 hidden md:block" />
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg text-zinc-600 group-hover:text-blue-500">
              {nom}
            </h3>
            <div className="text-neutral-400">{texte}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};
