/*
  Warnings:

  - You are about to drop the column `pythonCode` on the `Dashboard` table. All the data in the column will be lost.
  - You are about to drop the column `pythonCode` on the `Panel` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.
  - Made the column `thumbnailPath` on table `Dashboard` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Dashboard" DROP COLUMN "pythonCode",
ALTER COLUMN "thumbnailPath" SET NOT NULL;

-- AlterTable
ALTER TABLE "Panel" DROP COLUMN "pythonCode";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAdmin",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
