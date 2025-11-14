import { Article } from "@prisma/client";
import HeaderPage from "../features/header-page";
import Writor from "../features/Writor";

const DetailArticle = ({ article }: { article: Article }) => {
  return (
    <div>
      <HeaderPage
        chemins={[
          { title: "Question Frequentes", url: "/frequents" },
          { title: "Details Article", url: "#" }
        ]}
      ></HeaderPage>
      <div className="flex flex-col items-center gap-4 px-5 py-5">
        <div className="flex flex-col space-y-3 p-6 sm:w-full md:w-[700px] lg:w-[950px] xl:w-[1150px]">
          <h2 className="text-2xl font-semibold text-blue-500">
            {article?.titre}
          </h2>
          <hr />
          <p className="italic text-zinc-500">{article?.description}</p>
          <Writor value={article?.contenu || ""} />
        </div>
      </div>
    </div>
  );
};
export default DetailArticle;
