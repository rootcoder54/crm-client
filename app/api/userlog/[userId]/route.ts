import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { requireRoleAdmin } from "@/lib/permissions";
import { getLogsByUser } from "@/services/log.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const { userId } = await params;
  if (userId !== session.user.id) {
    try { await requireRoleAdmin(); }
    catch { return NextResponse.json({ error: "Accès interdit" }, { status: 403 }); }
  }
  try {
    const logs = await getLogsByUser(userId);
    return NextResponse.json(logs);
  } catch {
    return NextResponse.json({ error: "Lecture des journaux impossible" }, { status: 500 });
  }
}
