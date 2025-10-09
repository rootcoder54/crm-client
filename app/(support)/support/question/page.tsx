"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

import Image from "next/image";
import Link from "next/link";
import { TbHelpSquareRoundedFilled } from "react-icons/tb";

const PageQuestion = () => {
  return (
    <div className="flex flex-col justify-center items-start gap-y-3 py-4 space-y-3">
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
      <Image src={"/question.png"} alt="logo" width={40} height={30} />
      <h1 className="text-2xl font-bold">Vos questions fréquentes</h1>
      <span className="text-neutral-400">
        Regroupe les thématiques qui reviennent le plus souvent dans vos
        interrogations
      </span>
    </div>
  );
};

export default PageQuestion;
