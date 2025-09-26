/*
 * @Author: hu.chao 491623426@qq.com
 * @Date: 2024-04-27 21:55:09
 * @LastEditors: hu.chao 491623426@qq.com
 * @LastEditTime: 2024-05-11 22:45:11
 * @FilePath: /art-template/src/modules/monitor/login-infor/login-infor.module.ts
 * @Description:
 *
 */
import { Global, Module } from '@nestjs/common';
import { LoginInforService } from './login-infor.service';
import { LoginInforController } from './login-infor.controller';

@Global()
@Module({
  providers: [LoginInforService],
  exports: [LoginInforService],
  controllers: [LoginInforController],
})
export class LoginInforModule {}
