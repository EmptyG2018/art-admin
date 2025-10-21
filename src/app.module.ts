import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { AppController } from './app.controller';
import { SysModule } from './modules/sys/sys.module';
import { LoginModule } from './modules/login/login.module';
import { MonitorModule } from './modules/monitor/monitor.module';
import { CommonModule } from './modules/common/common.module';
import { NotifyModule } from './modules/notify/notify.module';

@Module({
  imports: [
    SharedModule,
    CommonModule,
    SysModule,
    LoginModule,
    MonitorModule,
    NotifyModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
