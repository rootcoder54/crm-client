import { NextResponse } from "next/server";
import { getLogsByUser } from "@/services/log.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const logs = await getLogsByUser(userId);
    return NextResponse.json(logs);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
