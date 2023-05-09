/*
  Warnings:

  - You are about to drop the column `dashboardHistoryId` on the `PanelsOnDashboards` table. All the data in the column will be lost.
  - You are about to drop the `DashboardHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DashboardHistory" DROP CONSTRAINT "DashboardHistory_linkedId_fkey";

-- DropForeignKey
ALTER TABLE "DashboardHistory" DROP CONSTRAINT "DashboardHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "PanelsOnDashboards" DROP CONSTRAINT "PanelsOnDashboards_dashboardHistoryId_fkey";

-- AlterTable
ALTER TABLE "PanelsOnDashboards" DROP COLUMN "dashboardHistoryId";

-- DropTable
DROP TABLE "DashboardHistory";

-- CreateTable
CREATE TABLE "DashboardIteration" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "dashboardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "DashboardIteration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DashboardIteration" ADD CONSTRAINT "DashboardIteration_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
