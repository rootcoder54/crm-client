-- A role name identifies a permission for a given user, not globally.
-- This is compatible with existing records because the old unique constraint was stricter.
DROP INDEX "UserRole_name_key";
CREATE UNIQUE INDEX "UserRole_userId_name_key" ON "UserRole"("userId", "name");
CREATE INDEX "UserRole_userId_url_idx" ON "UserRole"("userId", "url");
