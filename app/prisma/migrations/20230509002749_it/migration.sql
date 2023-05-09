/*
  Warnings:

  - Added the required column `grafanaJSON` to the `DashboardIteration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DashboardIteration" ADD COLUMN     "grafanaJSON" JSONB NOT NULL;
