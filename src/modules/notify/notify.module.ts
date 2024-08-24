/*
 * @Author: HuChao 491623426@qq.com
 * @Date: 2024-05-13 13:59:22
 * @LastEditors: HuChao 491623426@qq.com
 * @LastEditTime: 2024-05-17 15:44:23
 * @FilePath: \meimei-new\src\modules\sys\sys.module.ts
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { NotifyMailerModule } from './notify-mailer/notify-mailer.module';

@Module({
  imports: [NotifyMailerModule],
})
export class NotifyModule {}
