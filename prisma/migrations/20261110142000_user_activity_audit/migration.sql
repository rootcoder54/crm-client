-- SQLite: preserve existing logs and change on-delete behavior to SET NULL.
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Log" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "action" TEXT NOT NULL,
  "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "details" TEXT,
  "entity" TEXT,
  "entityId" TEXT,
  "route" TEXT,
  "actorUsername" TEXT,
  "userId" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO "new_Log" ("id", "action", "timestamp", "details", "entity", "entityId", "route", "actorUsername", "userId", "createdAt", "updatedAt")
SELECT l."id", l."action", l."timestamp", l."details", NULL, NULL, NULL, u."username", l."userId", l."createdAt", l."updatedAt"
FROM "Log" AS l
LEFT JOIN "User" AS u ON u."id" = l."userId";

DROP TABLE "Log";
ALTER TABLE "new_Log" RENAME TO "Log";
CREATE INDEX "Log_userId_timestamp_idx" ON "Log"("userId", "timestamp");
CREATE INDEX "Log_entity_timestamp_idx" ON "Log"("entity", "timestamp");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
