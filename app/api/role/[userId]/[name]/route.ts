import { NextResponse } from "next/server";
import { getUserRoleByName } from "@/services/userRole.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string; name: string }> }
) {
  try {
    const { userId, name } = await params;
    const userRole = await getUserRoleByName(userId, name);
    return NextResponse.json(userRole);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
