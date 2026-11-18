import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

import { evaluatePermission, type PermissionAction } from "@/lib/permission-rules";
export type { PermissionAction } from "@/lib/permission-rules";

export class PermissionError extends Error {
  constructor(message: string, public readonly status: 401 | 403) {
    super(message);
    this.name = "PermissionError";
  }
}

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
  return evaluatePermission(rules, route, action, legacyName);
}

export async function requirePermission(
  route: string,
  action: PermissionAction,
  legacyName?: string,
) {
  const session = await auth();
  if (!session?.user?.id) throw new PermissionError("Non authentifié", 401);
  if (!(await canAccess(session.user.id, route, action, legacyName))) {
    throw new PermissionError("Accès refusé : permission insuffisante", 403);
  }
  return session.user.id;
}

/** Explicit bootstrap list. Do not infer an administrator from a role he can edit. */
export async function requireRoleAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new PermissionError("Non authentifié", 401);
  const ids = (process.env.CRM_ROLE_ADMIN_USER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (!ids.includes(session.user.id)) throw new Error("Administration des rôles interdite");
  return session.user.id;
}
