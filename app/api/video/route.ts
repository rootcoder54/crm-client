import { getAllVideos } from "@/services/video.service";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const videos = await getAllVideos();
    const listes =
          videos?.map((v) => ({
            id: v.id,
            nom: v.nom,
            description: v.description,
            url: v.url,
          })) || [];
    return NextResponse.json(listes);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
