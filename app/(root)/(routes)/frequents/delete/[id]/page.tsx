import DeleteArticle from "@/components/article/delete-article";
import { getArticleById } from "@/services/article.service";
import { Article } from "@prisma/client";

interface pageProps {
  params: Promise<{ id: string }>;
}
const DeleteQuestionPage = async ({ params }: pageProps) => {
  const { id } = await params;
  const article = (await getArticleById(id)) as Article;
  return (
    <div>
      <DeleteArticle article={article} />
    </div>
  );
};

export default DeleteQuestionPage;
