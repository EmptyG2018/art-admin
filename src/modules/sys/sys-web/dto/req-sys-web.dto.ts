/*
 * @Author: HuChao 491623426@qq.com
 * @Date: 2024-05-17 17:21:17
 * @LastEditors: HuChao 491623426@qq.com
 * @LastEditTime: 2024-05-17 17:30:04
 * @FilePath: \meimei-new\src\modules\sys\sys-web\dto\req-sys-web.dto.ts
 * @Description:
 *
 */
import { IsOptional, IsString } from 'class-validator';
import { DataBaseDto } from 'src/common/dto/data-base.dto';

export class AddSysWebDto extends DataBaseDto {
  /* 主题  */
  @IsOptional()
  @IsString()
  theme?: string;
}

export class UpdateSysWebDto extends DataBaseDto {}
