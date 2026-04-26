/*
  Warnings:

  - Made the column `withBox` on table `Mission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Mission" ALTER COLUMN "adminDate" DROP NOT NULL,
ALTER COLUMN "withBox" SET NOT NULL;
