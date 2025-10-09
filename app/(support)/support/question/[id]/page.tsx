import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { TbHelpSquareRoundedFilled } from "react-icons/tb";

interface QuestionIdPageProps {
  params: Promise<{ id: string }>;
}

const QuestionID = async ({ params }: QuestionIdPageProps) => {
  const { id } = await params;
  return (
    <div>
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
                <Link
                  href={"/support/question"}
                  className="text-sm text-zinc-700 font-bold flex gap-2 items-end"
                >
                  Vos questions fréquentes
                </Link>
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 text-base">
                <span className="text-sm text-zinc-400 font-bold"></span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-bold">Question ID: {id}</h1>
      </div>
    </div>
  );
};

export default QuestionID;
