/*
  Warnings:

  - You are about to drop the column `deptCheckStrictly` on the `sys_role` table. All the data in the column will be lost.
  - You are about to drop the column `menuCheckStrictly` on the `sys_role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sys_role` DROP COLUMN `deptCheckStrictly`,
    DROP COLUMN `menuCheckStrictly`;
