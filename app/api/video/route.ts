import { getAllVideos } from "@/services/video.service";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const videos = await getAllVideos();

    return NextResponse.json(videos);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
