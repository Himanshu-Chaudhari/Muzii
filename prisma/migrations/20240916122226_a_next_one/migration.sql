/*
  Warnings:

  - You are about to drop the column `actice` on the `Stream` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "actice",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
