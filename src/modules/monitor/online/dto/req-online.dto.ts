/*
 * @Author: HuChao 491623426@qq.com
 * @Date: 2024-05-16 16:44:43
 * @LastEditors: HuChao 491623426@qq.com
 * @LastEditTime: 2024-05-16 16:45:15
 * @FilePath: \art-admin\src\modules\monitor\online\dto\req-online.dto copy.ts
 * @Description: 
 * 
 */
import { IsOptional, IsString } from 'class-validator';

export class OnlineList {
  /* 登录地址 */
  @IsOptional()
  @IsString()
  ipaddr?: string;

  /* 用户名 */
  @IsOptional()
  @IsString()
  userName?: string;
}
