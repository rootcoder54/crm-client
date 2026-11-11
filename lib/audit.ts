import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { auditMessage, getAuditTitle } from "@/lib/audit-messages";

export type AuditAction =
  | "CREATE" | "UPDATE" | "DELETE" | "READ" | "CLOSE"
  | "LOGIN" | "LOGOUT";

type Metadata = {
  entity: string;
  entityId?: string | null;
  route: string;
  details?: string;
};

async function currentActor() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non authentifié");
  return {
    userId: session.user.id,
    actorUsername: session.user.username || session.user.name || null,
  };
}

/**
 * The business write and the audit event commit together or both roll back.
 * Only pass a safe summary, never passwords, cookies, tokens or full records.
 */
export async function auditedMutation<T>(
  action: Exclude<AuditAction, "READ" | "LOGIN" | "LOGOUT">,
  meta: Omit<Metadata, "entityId">,
  run: (tx: Prisma.TransactionClient) => Promise<T>,
  getId: (value: T) => string | null | undefined,
): Promise<T> {
  const actor = await currentActor();
  return prisma.$transaction(async (tx) => {
    const value = await run(tx);
    await tx.log.create({
      data: {
        action,
        entity: meta.entity,
        entityId: getId(value) ?? null,
        route: meta.route,
        details: meta.details?.slice(0, 500) ?? auditMessage(action, meta.entity, getAuditTitle(meta.entity, value)),
        ...actor,
      },
    });
    return value;
  });
}

/**
 * Audit reads after they succeed. A failed audit write rejects the read response
 * instead of silently serving an unlogged sensitive resource.
 */
export async function auditRead(meta: Metadata) {
  const actor = await currentActor();
  const pathname = meta.route.replace(/\\/$/, "") || "/";
  // Une seule visite par utilisateur, par page et par tranche de 30 secondes.
  // La contrainte UNIQUE protège aussi contre deux demandes concurrentes.
  const bucket = Math.floor(Date.now() / 30_000);
  const dedupeKey = `${actor.userId}:${pathname}:${bucket}`;
  await prisma.log.create({
    data: {
      action: "READ",
      entity: meta.entity,
      entityId: meta.entityId ?? null,
      route: pathname,
      details: meta.details?.slice(0, 500) ?? auditMessage("READ", meta.entity),
      dedupeKey,
      ...actor,
    },
  }).catch((error: unknown) => {
    // P2002 = violation de contrainte unique (navigation déjà enregistrée).
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return;
    }
    throw error;
  });
}

export async function auditedRead<T>(
  meta: Metadata,
  run: () => Promise<T>,
): Promise<T> {
  const value = await run();
  await auditRead(meta);
  return value;
}
