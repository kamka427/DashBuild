/*
  Warnings:

  - Added the required column `updatedAt` to the `Dashboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Panel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dashboard" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Panel" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PanelsOnDashboards" ADD COLUMN     "dashboardHistoryId" TEXT;

-- CreateTable
CREATE TABLE "DashboardHistory" (
    "id" TEXT NOT NULL,
    "linkedId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "published" BOOLEAN NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "thumbnailPath" TEXT NOT NULL,
    "grafanaJSON" JSONB NOT NULL,
    "grafanaUrl" TEXT,
    "columns" INTEGER NOT NULL DEFAULT 2,
    "tags" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DashboardHistory_linkedId_key" ON "DashboardHistory"("linkedId");

-- AddForeignKey
ALTER TABLE "DashboardHistory" ADD CONSTRAINT "DashboardHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardHistory" ADD CONSTRAINT "DashboardHistory_linkedId_fkey" FOREIGN KEY ("linkedId") REFERENCES "Dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PanelsOnDashboards" ADD CONSTRAINT "PanelsOnDashboards_dashboardHistoryId_fkey" FOREIGN KEY ("dashboardHistoryId") REFERENCES "DashboardHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
