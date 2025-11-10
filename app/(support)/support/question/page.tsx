"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group";
import { TracingBeam } from "@/components/ui/tracing-beam";

import Link from "next/link";
import { BiSearchAlt2 } from "react-icons/bi";
import { TbHelpSquareRoundedFilled } from "react-icons/tb";

const PageQuestion = () => {
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
            />
            <InputGroupAddon>
              <BiSearchAlt2 className="h-7 w-7 text-blue-700" />
            </InputGroupAddon>
          </InputGroup>
        </div>{" "}
      </TracingBeam>
    </div>
  );
};

export default PageQuestion;
