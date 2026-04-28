import { getRequetesTech } from "@/services/requete.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const requete = await getRequetesTech();
    const listes = requete?.map((req) => ({
      technicien: req.technicien
    }));
    return NextResponse.json(listes);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
