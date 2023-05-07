/*
  Warnings:

  - Made the column `grafanaJSON` on table `Dashboard` required. This step will fail if there are existing NULL values in that column.
  - Made the column `grafanaJSON` on table `Panel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `thumbnailPath` on table `Panel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Dashboard" ALTER COLUMN "grafanaJSON" SET NOT NULL;

-- AlterTable
ALTER TABLE "Panel" ALTER COLUMN "grafanaJSON" SET NOT NULL,
ALTER COLUMN "thumbnailPath" SET NOT NULL;
