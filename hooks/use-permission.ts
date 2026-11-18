"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { UserRole } from "@prisma/client";

import { evaluatePermission, type PermissionAction } from "@/lib/permission-rules";

/** Returns false while the current user's rules are loading (fail closed in UI). */
export function usePermission(route: string, action: PermissionAction, legacyName?: string) {
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
  return evaluatePermission(data, route, action, legacyName);
}
