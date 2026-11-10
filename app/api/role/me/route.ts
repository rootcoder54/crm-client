import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const roles = await prisma.userRole.findMany({ where: { userId: session.user.id } });
  return NextResponse.json(roles);
}
