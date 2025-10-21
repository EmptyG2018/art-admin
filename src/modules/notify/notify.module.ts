import { Module } from '@nestjs/common';
import { NotifyMailerModule } from './notify-mailer/notify-mailer.module';

@Module({
  imports: [NotifyMailerModule],
})
export class NotifyModule {}
