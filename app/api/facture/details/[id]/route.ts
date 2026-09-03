import { NextResponse } from "next/server";
import { getFactureById } from "@/services/facture.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const facture = await getFactureById(id);
    return NextResponse.json(facture);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
