/*
  Warnings:

  - You are about to drop the `sys_table` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sys_web` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `sys_table`;

-- DropTable
DROP TABLE `sys_web`;

-- CreateTable
CREATE TABLE `sys_webssss` (
    `webId` INTEGER NOT NULL AUTO_INCREMENT,
    `theme` VARCHAR(500) NULL,
    `createBy` VARCHAR(64) NOT NULL,
    `createTime` DATETIME(3) NULL,
    `updateBy` VARCHAR(64) NULL DEFAULT '',
    `updateTime` DATETIME(3) NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `sys_webssss_createBy_key`(`createBy`),
    UNIQUE INDEX `sys_webssss_userId_key`(`userId`),
    PRIMARY KEY (`webId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_webssss` ADD CONSTRAINT `sys_webssss_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `sys_user`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
