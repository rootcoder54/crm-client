"use client";

import { Input } from "@/components/ui/input";
import { AlignVerticalJustifyEnd } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoVideocamOff } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { videos } from "@/constante/videoAstuce";

const AstucePage = () => {
  const [search, setSearch] = useState("");

  // Filtrage par nom ou description
  const filteredVideos = videos.filter(
    (video) =>
      video.nom.toLowerCase().includes(search.toLowerCase()) ||
      video.description.toLowerCase().includes(search.toLowerCase()) ||
      video.detail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-6 py-10">
      <h1 className="text-3xl font-bold text-neutral-600">Vidéos pratiques</h1>
      <div className="w-full border rounded-md shadow px-3 py-1 flex items-center group">
        <BiSearchAlt2 className="h-7 w-7 text-blue-700" />
        <Input
          placeholder="Recherche..."
          className="border-0 text-blue-700 placeholder:text-zinc-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full hover:bg-zinc-200"
            onClick={() => setSearch("")}
          >
            <IoMdClose className="h-5 w-5 text-zinc-500" />
          </Button>
        )}
      </div>
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
    </div>
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
            <div className="text-neutral-400">{description}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};
