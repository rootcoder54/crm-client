-- Une clé d'idempotence est seulement utilisée pour les consultations de pages
-- et non pour les modifications métier (qui doivent toujours être tracées).
ALTER TABLE "Log" ADD COLUMN "dedupeKey" TEXT;
CREATE UNIQUE INDEX "Log_dedupeKey_key" ON "Log"("dedupeKey");
