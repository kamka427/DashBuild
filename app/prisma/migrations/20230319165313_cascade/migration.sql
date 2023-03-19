-- DropForeignKey
ALTER TABLE "PanelsOnDashboards" DROP CONSTRAINT "PanelsOnDashboards_dashboardId_fkey";

-- DropForeignKey
ALTER TABLE "PanelsOnDashboards" DROP CONSTRAINT "PanelsOnDashboards_panelId_fkey";

-- AddForeignKey
ALTER TABLE "PanelsOnDashboards" ADD CONSTRAINT "PanelsOnDashboards_panelId_fkey" FOREIGN KEY ("panelId") REFERENCES "Panel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PanelsOnDashboards" ADD CONSTRAINT "PanelsOnDashboards_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
