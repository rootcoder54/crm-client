import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

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
        details: meta.details?.slice(0, 500) ?? null,
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
  await prisma.log.create({
    data: {
      action: "READ",
      entity: meta.entity,
      entityId: meta.entityId ?? null,
      route: meta.route,
      details: meta.details?.slice(0, 500) ?? null,
      ...actor,
    },
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
