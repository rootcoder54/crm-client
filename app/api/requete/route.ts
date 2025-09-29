import { NextResponse } from "next/server";

import { getAllRequetes } from "@/services/requete.service";

export async function GET() {
  try {
    const requetes = await getAllRequetes();

    return NextResponse.json(requetes);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
