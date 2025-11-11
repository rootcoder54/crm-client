import { getAllArticles } from "@/services/article.service";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const articles = await getAllArticles();

    return NextResponse.json(articles);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
