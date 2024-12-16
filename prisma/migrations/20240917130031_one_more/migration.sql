/*
  Warnings:

  - Added the required column `title` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "largeThubnail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "smallThumbnail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title" TEXT NOT NULL;
