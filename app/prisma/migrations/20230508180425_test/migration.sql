/*
  Warnings:

  - Made the column `createdAt` on table `DashboardHistory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `DashboardHistory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Panel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Panel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DashboardHistory" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Panel" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;
