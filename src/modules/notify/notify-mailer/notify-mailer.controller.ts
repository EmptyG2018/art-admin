/*
 * @Author: hu.chao 491623426@qq.com
 * @Date: 2024-04-27 15:34:31
 * @LastEditors: HuChao 491623426@qq.com
 * @LastEditTime: 2024-05-16 12:39:48
 * @FilePath: \art-template\src\modules\sys\sys-config\sys-config.controller.ts
 * @Description: 系统参数
 *
 */
import { Controller } from '@nestjs/common';

import { NotifyMailerService } from './notify-mailer.service';

@Controller('notify/config')
export class NotifyMailerController {
  constructor(private readonly notifyMailerService: NotifyMailerService) {}
}
