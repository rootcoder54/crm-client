import EditeArticle from "@/components/article/edite-article";
import { getArticleById } from "@/services/article.service";
import { Article } from "@prisma/client";

interface pageProps {
  params: Promise<{ id: string }>;
}
const EditeQuestionPage = async ({ params }: pageProps) => {
  const { id } = await params;
  const article = (await getArticleById(id)) as Article;
  return (
    <div>
      <EditeArticle article={article} />
    </div>
  );
};

export default EditeQuestionPage;
