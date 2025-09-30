import { NextResponse } from "next/server";
import { getRequeteById } from "@/services/requete.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requete = await getRequeteById(id);
    return NextResponse.json(requete);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
