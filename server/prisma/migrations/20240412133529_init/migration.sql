/*
  Warnings:

  - Added the required column `refreshToken` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Users` ADD COLUMN `refreshToken` VARCHAR(191) NOT NULL;
