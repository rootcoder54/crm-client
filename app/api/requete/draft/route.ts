import { NextResponse } from "next/server";

import { getDraftRequetes } from "@/services/requete.service";

export async function GET() {
  try {
    const requetes = await getDraftRequetes();

    return NextResponse.json(requetes);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
