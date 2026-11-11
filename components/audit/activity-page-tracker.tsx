"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * Une consultation est une navigation, pas un appel Prisma :
 * une page peut déclencher plusieurs lectures (React Query, préchargement, etc.).
 */
export function ActivityPageTracker() {
  const pathname = usePathname();
  const { status } = useSession();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      lastTracked.current = null;
      return;
    }
    if (!pathname || pathname === "/userlog" || lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    void fetch("/api/activity/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ pathname }),
    }).catch(() => {
      // La navigation ne doit pas être bloquée par la télémétrie.
    });
  }, [pathname, status]);

  return null;
}
