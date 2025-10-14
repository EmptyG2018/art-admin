/*
 * @Author: yun.ze 491623426@qq.com
 * @Date: 2024-05-17 15:45:25
 * @LastEditors: yun.ze 491623426@qq.com
 * @LastEditTime: 2024-05-17 20:07:11
 * @FilePath: /art-admin/src/modules/sys/sys-web/sys-web.service.ts
 * @Description:
 *
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { WEB_CONFIG_KEY } from 'src/common/contants/redis.contant';
import { AddSysWebDto } from './dto/req-sys-web.dto';

@Injectable()
export class SysWebService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async getOne(userId: number) {
    const webString = await this.redis.get(`${WEB_CONFIG_KEY}:${userId}`);
    if (webString) return JSON.parse(webString);
    const web = await this.prisma.sysWeb.findUnique({
      where: {
        userId,
      },
    });
    if (web) {
      const { userId, ...rest } = web;
      await this.redis.set(`${WEB_CONFIG_KEY}:${userId}`, JSON.stringify(rest));
      return rest;
    }
  }

  /* 新增或者编辑 */
  async add(userId: number, addSysWebDto: AddSysWebDto) {
    await this.prisma.sysWeb.upsert({
      where: {
        userId,
      },
      update: addSysWebDto,
      create: {
        ...addSysWebDto,
        user: {
          connect: { userId },
        },
      },
    });
    await this.redis.del(`${WEB_CONFIG_KEY}:${userId}`);
  }

  /* 重置配置 */
  async delete(userId: number) {
    const web = await this.prisma.sysWeb.findUnique({
      where: {
        userId,
      },
    });
    if (web) {
      await this.prisma.sysWeb.delete({
        where: {
          userId,
        },
      });
      await this.redis.del(`${WEB_CONFIG_KEY}:${userId}`);
    }
  }
}
