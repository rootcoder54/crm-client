import { NextResponse } from "next/server";

import { getAllFactures } from "@/services/facture.service";

export async function GET() {
  try {
    const factures = await getAllFactures();

    return NextResponse.json(factures);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
