"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { TbHelpSquareRoundedFilled } from "react-icons/tb";
import { usePathname } from "next/navigation";
import { videos } from "@/constante/videoAstuce";

type Video = {
  id: string;
  nom: string;
  description: string;
  detail: string;
  video: string;
};
const AstuceLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [video, setvideo] = useState<Video | undefined>();
  useEffect(() => {
    if (pathname !== "/support/astuce") {
      const id = pathname.split("/")[3];
      const video = videos.find((item) => item.id === id);
      setvideo(video);
    }
  }, [pathname]);

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
              {pathname === "/support/astuce" ? (
                <span className="text-zinc-500 font-bold">
                  Videos pratiques
                </span>
              ) : (
                <Link
                  href={"/support/astuce"}
                  className="text-zinc-700 font-bold flex items-end"
                >
                  <span className="font-bold">Videos pratiques</span>
                </Link>
              )}
            </BreadcrumbPage>
          </BreadcrumbItem>
          {video && pathname !== "/support/astuce" && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 text-base">
                  <span className="text-zinc-500 font-bold">{video.nom}</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      {children}
    </div>
  );
};

export default AstuceLayout;
