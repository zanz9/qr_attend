/*
  Warnings:

  - Added the required column `expiresIn` to the `Lessons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startedAt` to the `Lessons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Lessons` ADD COLUMN `expiresIn` DATETIME(3) NOT NULL,
    ADD COLUMN `startedAt` DATETIME(3) NOT NULL;
