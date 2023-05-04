-- AlterTable
ALTER TABLE "Dashboard" ADD COLUMN     "thumbnail" BYTEA;

-- AlterTable
ALTER TABLE "Panel" ADD COLUMN     "pythonCode" TEXT,
ADD COLUMN     "thumbnail" BYTEA;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
