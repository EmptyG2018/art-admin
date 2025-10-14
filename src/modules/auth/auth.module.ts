/*
 * @Author: yun.ze 491623426@qq.com
 * @Date: 2024-04-23 19:15:56
 * @LastEditors: yun.ze 491623426@qq.com
 * @LastEditTime: 2024-05-15 23:16:35
 * @FilePath: /art-admin/src/modules/auth/auth.module.ts
 * @Description:
 *
 */
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { LoginModule } from '../login/login.module';

@Module({
  imports: [PassportModule],
  controllers: [],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
