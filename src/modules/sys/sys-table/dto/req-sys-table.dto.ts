/*
 * @Author: HuChao 491623426@qq.com
 * @Date: 2024-05-17 17:21:17
 * @LastEditors: hu.chao 491623426@qq.com
 * @LastEditTime: 2024-05-17 20:28:15
 * @FilePath: /art-admin/src/modules/sys/sys-table/dto/req-sys-table.dto.ts
 * @Description:
 *
 */
import { IsString } from 'class-validator';
import { DataBaseDto } from 'src/common/dto/data-base.dto';

/* 请求表格配置 */
export class GetTableDto {
  @IsString()
  tableId: string;
}

/* 新增或者编辑表格配置 */
export class AddSysTableDto extends DataBaseDto {
  @IsString()
  tableId: string;

  @IsString()
  tableJsonConfig: string;

  createBy: string;
}
