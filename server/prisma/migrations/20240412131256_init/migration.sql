/*
  Warnings:

  - You are about to drop the `Attend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Attend` DROP FOREIGN KEY `Attend_lessonId_fkey`;

-- DropForeignKey
ALTER TABLE `Attend` DROP FOREIGN KEY `Attend_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Lesson` DROP FOREIGN KEY `Lesson_createdFrom_fkey`;

-- DropTable
DROP TABLE `Attend`;

-- DropTable
DROP TABLE `Lesson`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lessons` (
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `createdFrom` INTEGER NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attends` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Lessons` ADD CONSTRAINT `Lessons_createdFrom_fkey` FOREIGN KEY (`createdFrom`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attends` ADD CONSTRAINT `Attends_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attends` ADD CONSTRAINT `Attends_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lessons`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
