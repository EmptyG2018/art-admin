/*
 * @Author: hu.chao 491623426@qq.com
 * @Date: 2024-05-17 20:08:51
 * @LastEditors: hu.chao 491623426@qq.com
 * @LastEditTime: 2024-05-17 20:25:37
 * @FilePath: /meimei-new/src/modules/sys/sys-table/sys-table.module.ts
 * @Description: 
 * 
 */
import { Module } from '@nestjs/common';
import { SysTableController } from './sys-table.controller';
import { SysTableService } from './sys-table.service';

@Module({
  controllers: [SysTableController],
  providers: [SysTableService],
})
export class SysTableModule {}
