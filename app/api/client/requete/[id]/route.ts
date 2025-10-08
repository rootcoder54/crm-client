import { NextResponse } from "next/server";
import { getRequetesByClient } from "@/services/requete.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requete = await getRequetesByClient(id);
    return NextResponse.json(requete);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
