"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { UserRole } from "@prisma/client";

type Action = "read" | "create" | "update" | "delete";
const minimum = { read: 1, create: 2, update: 2, delete: 3 } as const;

/** Returns false while the current user's rules are loading (fail closed in UI). */
export function usePermission(route: string, action: Action, legacyName?: string) {
  const { data: session, status } = useSession();
  const { data, isPending } = useQuery<UserRole[]>({
    queryKey: ["my-permissions", session?.user?.id],
    enabled: status === "authenticated" && !!session?.user?.id,
    queryFn: async () => {
      const response = await fetch("/api/role/me");
      if (!response.ok) throw new Error("Permissions indisponibles");
      return response.json();
    },
  });
  if (status !== "authenticated" || isPending || !data) return false;
  const legacy = legacyName ? data.find((r) => r.name === legacyName) : undefined;
  if (legacy) return legacy.accessLevel !== 0;
  const rules = data.filter((r) => r.url && (route === r.url || route.startsWith(r.url.replace(/\/$/, "") + "/")))
    .sort((a,b) => (b.url?.length ?? 0) - (a.url?.length ?? 0));
  return rules.length ? rules[0].accessLevel >= minimum[action] : true;
}
