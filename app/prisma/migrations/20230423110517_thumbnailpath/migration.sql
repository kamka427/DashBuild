/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `Dashboard` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `Panel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dashboard" DROP COLUMN "thumbnail",
ADD COLUMN     "thumbnailPath" TEXT;

-- AlterTable
ALTER TABLE "Panel" DROP COLUMN "thumbnail",
ADD COLUMN     "thumbnailPath" TEXT;
