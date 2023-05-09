-- DropForeignKey
ALTER TABLE "Dashboard" DROP CONSTRAINT "Dashboard_userId_fkey";

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
