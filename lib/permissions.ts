import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export type PermissionAction = "read" | "create" | "update" | "delete";
const minimum: Record<PermissionAction, number> = { read: 1, create: 2, update: 2, delete: 3 };

/**
 * Legacy rules named requete_delete / requete_edite / requete_cloture / requete_intervention
 * have accessLevel=0 to DENY and a nonzero level to ALLOW.
 * Scoped rules use a resource name (e.g. requete) and a URL (/requete).
 * No matching rule means legacy-compatible ALLOW during gradual migration.
 */
export async function canAccess(
  userId: string,
  route: string,
  action: PermissionAction,
  legacyName?: string,
): Promise<boolean> {
  const rules = await prisma.userRole.findMany({ where: { userId } });
  if (legacyName) {
    const legacy = rules.find((r) => r.name === legacyName);
    if (legacy) return legacy.accessLevel !== 0;
  }
  const candidates = rules
    .filter((r) => r.url && (route === r.url || route.startsWith(r.url.replace(/\/$/, "") + "/")))
    .sort((a, b) => (b.url?.length ?? 0) - (a.url?.length ?? 0));
  if (!candidates.length) return true;
  return candidates[0].accessLevel >= minimum[action];
}

export async function requirePermission(
  route: string,
  action: PermissionAction,
  legacyName?: string,
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non authentifié");
  if (!(await canAccess(session.user.id, route, action, legacyName))) {
    throw new Error("Accès refusé : permission insuffisante");
  }
  return session.user.id;
}

/** Explicit bootstrap list. Do not infer an administrator from a role he can edit. */
export async function requireRoleAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non authentifié");
  const ids = (process.env.CRM_ROLE_ADMIN_USER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (!ids.includes(session.user.id)) throw new Error("Administration des rôles interdite");
  return session.user.id;
}
