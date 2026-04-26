-- DropForeignKey
ALTER TABLE "Mission" DROP CONSTRAINT "Mission_userId_fkey";

-- AlterTable
ALTER TABLE "Mission" ALTER COLUMN "userId" DROP NOT NULL;
