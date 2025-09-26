-- DropIndex
DROP INDEX `sys_web_createBy_key` ON `sys_web`;

-- AlterTable
ALTER TABLE `sys_menu` MODIFY `icon` VARCHAR(100) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `sys_web` MODIFY `theme` VARCHAR(500) NULL DEFAULT '{}',
    MODIFY `createBy` VARCHAR(64) NULL DEFAULT '';
