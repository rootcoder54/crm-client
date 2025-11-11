import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { TbHelpSquareRoundedFilled } from "react-icons/tb";
import { getArticleById } from "@/services/article.service";
import Writor from "@/components/features/Writor";

interface QuestionIdPageProps {
  params: Promise<{ id: string }>;
}

const QuestionID = async ({ params }: QuestionIdPageProps) => {
  const { id } = await params;
  const article = await getArticleById(id);
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
            <BreadcrumbPage className="line-clamp-1">
              <Link
                href={"/support/question"}
                className="text-zinc-700 font-bold flex gap-x-2 items-center text-base"
              >
                <span>Vos questions fréquentes</span>
              </Link>
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1 text-base">
              <span className="text-sm text-zinc-400 font-bold">
                {article?.titre}
              </span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col items-center gap-4 px-5 py-5">
        <div className="flex flex-col space-y-3 p-6 sm:w-full md:w-[700px] lg:w-[950px] xl:w-[1150px]">
          <h2 className="text-2xl font-semibold text-blue-500">
            {article?.titre}
          </h2>
          <hr />
          <p className="italic text-zinc-500">
            {article?.description}
          </p>
          <Writor value={article?.contenu || ""} />
        </div>
      </div>
    </div>
  );
};

export default QuestionID;
