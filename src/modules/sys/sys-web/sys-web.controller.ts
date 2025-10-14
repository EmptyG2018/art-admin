/*
 * @Author: yun.ze 491623426@qq.com
 * @Date: 2024-05-17 19:47:46
 * @LastEditors: yun.ze 491623426@qq.com
 * @LastEditTime: 2024-05-17 20:00:47
 * @FilePath: /art-admin/src/modules/sys/sys-web/sys-web.controller.ts
 * @Description:
 *
 */
import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { SysWebService } from './sys-web.service';
import { User, UserEnum } from 'src/common/decorators/user.decorator';
import { DataObj } from 'src/common/class/data-obj.class';
import { CreateMessagePipe } from 'src/common/pipes/createmessage.pipe';
import { UpdateMessagePipe } from 'src/common/pipes/updatemessage.pipe';
import { AddSysWebDto, UpdateSysWebDto } from './dto/req-sys-web.dto';

@Controller('system/web')
export class SysWebController {
  constructor(private readonly sysWebService: SysWebService) {}

  /* 查询一条 */
  @Get()
  async getOne(@User(UserEnum.userId) userId: number) {
    const config = await this.sysWebService.getOne(userId);
    return DataObj.create(config);
  }

  @Post()
  async add(
    @Body(CreateMessagePipe) addSysWebDto: AddSysWebDto,
    @User(UserEnum.userId) userId: number,
  ) {
    await this.sysWebService.add(userId, addSysWebDto);
  }

  @Delete()
  async delete(@User(UserEnum.userId) userId: number) {
    await this.sysWebService.delete(userId);
  }
}
