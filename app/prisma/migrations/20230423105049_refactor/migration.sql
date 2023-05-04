/*
  Warnings:

  - You are about to drop the column `preview` on the `Dashboard` table. All the data in the column will be lost.
  - You are about to drop the column `representation` on the `Dashboard` table. All the data in the column will be lost.
  - You are about to drop the column `positionNumber` on the `Panel` table. All the data in the column will be lost.
  - You are about to drop the column `preview` on the `Panel` table. All the data in the column will be lost.
  - You are about to drop the column `representation` on the `Panel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dashboard" DROP COLUMN "preview",
DROP COLUMN "representation",
ADD COLUMN     "grafanaJSON" JSONB;

-- AlterTable
ALTER TABLE "Panel" DROP COLUMN "positionNumber",
DROP COLUMN "preview",
DROP COLUMN "representation",
ADD COLUMN     "grafanaJSON" JSONB;
