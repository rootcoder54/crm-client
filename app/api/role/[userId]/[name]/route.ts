import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string; name: string }> }
) {
  try {
    const { userId, name } = await params;
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    if (session.user.id !== userId) return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    const userRole = await prisma.userRole.findMany({ where: { userId, name } });
    return NextResponse.json(userRole);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
