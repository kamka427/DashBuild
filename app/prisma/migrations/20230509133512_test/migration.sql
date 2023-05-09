-- DropForeignKey
ALTER TABLE "DashboardIteration" DROP CONSTRAINT "DashboardIteration_dashboardId_fkey";

-- AddForeignKey
ALTER TABLE "DashboardIteration" ADD CONSTRAINT "DashboardIteration_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
