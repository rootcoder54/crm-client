export type PermissionAction = "read" | "create" | "update" | "delete";
export type PermissionRule = { name: string; url: string | null; accessLevel: number };
const minimum: Record<PermissionAction, number> = { read: 1, create: 2, update: 2, delete: 3 };

// These rules control one operation, never access to the whole resource.
export const legacyPermissionNames = [
  "requete_delete", "requete_edite", "requete_cloture", "requete_intervention",
] as const;

function normalizeRoute(route: string) {
  return route.replace(/\/+$/, "") || "/";
}

/** Shared by the server and UI. Preserve the existing legacy action overrides. */
export function evaluatePermission(
  rules: readonly PermissionRule[],
  route: string,
  action: PermissionAction,
  legacyName?: string,
): boolean {
  if (legacyName) {
    const legacy = rules.find((rule) => rule.name === legacyName);
    if (legacy) return legacy.accessLevel !== 0;
  }
  const path = normalizeRoute(route);
  const candidates = rules.filter((rule) => {
    if (!rule.url || legacyPermissionNames.some((name) => name === rule.name)) return false;
    const scope = normalizeRoute(rule.url);
    return scope === "/" || path === scope || path.startsWith(scope + "/");
  }).sort((a, b) => normalizeRoute(b.url!).length - normalizeRoute(a.url!).length);
  if (!candidates.length) return true;
  // Conflicting rules at the same scope must not depend on database row order.
  const specificity = normalizeRoute(candidates[0].url!).length;
  return candidates.filter((rule) => normalizeRoute(rule.url!).length === specificity)
    .every((rule) => rule.accessLevel >= minimum[action]);
}
