/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Panel` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Panel` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `PanelsOnDashboards` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PanelsOnDashboards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Panel" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "PanelsOnDashboards" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
