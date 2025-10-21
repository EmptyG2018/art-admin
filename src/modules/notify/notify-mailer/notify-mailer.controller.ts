import { Controller } from '@nestjs/common';

import { NotifyMailerService } from './notify-mailer.service';

@Controller('notify/config')
export class NotifyMailerController {
  constructor(private readonly notifyMailerService: NotifyMailerService) {}
}
