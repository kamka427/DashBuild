-- AlterTable
ALTER TABLE "Dashboard" ADD COLUMN     "columns" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "grafanaUrl" TEXT,
ADD COLUMN     "pythonCode" TEXT;

-- AlterTable
ALTER TABLE "Panel" ADD COLUMN     "grafanaUrl" TEXT,
ADD COLUMN     "width" INTEGER NOT NULL DEFAULT 1;
