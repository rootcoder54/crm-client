import { getInterventions } from "@/services/intervention.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const interventions = await getInterventions();

    return NextResponse.json(interventions);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
