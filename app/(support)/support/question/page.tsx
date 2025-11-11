"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { fetcher } from "@/lib/fetcher";
import { Article } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, BadgeQuestionMark } from "lucide-react";

import Link from "next/link";
import { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { TbHelpSquareRoundedFilled } from "react-icons/tb";

const PageQuestion = () => {
  const [search, setSearch] = useState("");

  const {
    isError,
    isPending,
    data: articles
  } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: () => fetcher(`/api/article`)
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
  const filtered = articles.filter(
    (article) =>
      article.titre.toLowerCase().includes(search.toLowerCase()) ||
      article.description.toLowerCase().includes(search.toLowerCase()) ||
      article?.contenu?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="container lg:w-[80%] px-5 lg:px-9 pt-5 pb-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">
              <Link
                href={"/support"}
                className="text-zinc-700 font-bold flex gap-x-2 items-center text-base"
              >
                <TbHelpSquareRoundedFilled className="h-8 w-8 text-blue-500" />{" "}
                <span>Support</span>
              </Link>
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1 text-base">
              <span className="text-sm text-zinc-400 font-bold">
                Vos questions fréquentes
              </span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <TracingBeam className="px-6">
        <div className="w-full flex flex-col gap-6 py-10">
          <h1 className="text-3xl font-bold text-neutral-600">
            Vos questions fréquentes
          </h1>
          <span className="text-neutral-400">
            Regroupe les thématiques qui reviennent le plus souvent dans vos
            interrogations
          </span>
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
          {filtered.length > 0 ? (
            filtered.map((article, index) => (
              <CardFrequent
                key={index}
                titre={article.titre}
                description={article.description}
                link={`/support/question/${article.id}`}
              />
            ))
          ) : (
            <div className="text-zinc-400 border rounded-md text-center p-5 border-blue-300 bg-blue-400/10 shadow flex flex-col items-center gap-2">
              <BadgeQuestionMark className="h-12 w-12 text-blue-500" />
              <span className="text-blue-500 text-lg">
                Aucune article trouvée pour &quot;{search}&quot;
              </span>
            </div>
          )}
        </div>{" "}
      </TracingBeam>
    </div>
  );
};

export default PageQuestion;

const CardFrequent = ({
  link,
  titre,
  description
}: {
  link: string;
  titre: string;
  description: string;
}) => {
  return (
    <Link
      href={link}
      className="rounded-md shadow p-4 flex gap-4 hover:bg-blue-400/10 group hover:border-blue-300 border"
    >
      <div className="flex-1">
        <div className="flex flex-row items-center gap-3">
          <BadgeQuestionMark className="w-14 group-hover:text-blue-500 hidden md:block" />
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg text-zinc-600 group-hover:text-blue-500">
              {titre}
            </h3>
            <div className="text-neutral-400">{description}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};
