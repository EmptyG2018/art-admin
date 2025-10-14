/*
 * @Author: yun.ze 491623426@qq.com
 * @Date: 2024-04-27 16:58:02
 * @LastEditors: yun.ze 491623426@qq.com
 * @LastEditTime: 2024-04-28 22:58:59
 * @FilePath: /art-admin/src/common/dto/params.dto.ts
 * @Description:
 *
 */
import { IsOptional, IsString } from 'class-validator';

export class ParamsDto {
  /* 开始日期 */
  @IsOptional()
  @IsString()
  beginTime?: string;

  /* 结束日期 */
  @IsOptional()
  @IsString()
  endTime?: string;
}
