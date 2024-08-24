import { Module } from '@nestjs/common';
import { NotifyMailerController } from './notify-mailer.controller';
import { NotifyMailerService } from './notify-mailer.service';

@Module({
  controllers: [NotifyMailerController],
  providers: [NotifyMailerService],
})
export class NotifyMailerModule {}
