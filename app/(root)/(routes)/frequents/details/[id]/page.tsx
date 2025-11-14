import DetailArticle from "@/components/article/detail-article";
import { getArticleById } from "@/services/article.service";
import { Article } from "@prisma/client";

interface pageProps {
  params: Promise<{ id: string }>;
}
const DetailQuestionPage = async ({ params }: pageProps) => {
  const { id } = await params;
  const article = (await getArticleById(id)) as Article;
  return <DetailArticle article={article} />;
};

export default DetailQuestionPage;
