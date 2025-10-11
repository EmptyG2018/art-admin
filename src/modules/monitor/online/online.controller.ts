/*
 * @Author: HuChao 491623426@qq.com
 * @Date: 2024-05-16 16:11:52
 * @LastEditors: hu.chao 491623426@qq.com
 * @LastEditTime: 2024-05-18 15:53:39
 * @FilePath: /art-admin/src/modules/monitor/online/online.controller.ts
 * @Description:
 *
 */
/*
 * @Author: HuChao 491623426@qq.com
 * @Date: 2024-05-16 16:11:52
 * @LastEditors: HuChao 491623426@qq.com
 * @LastEditTime: 2024-05-16 17:01:09
 * @FilePath: \art-admin\src\modules\monitor\online\online.controller.ts
 * @Description:
 *
 */
import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { OnlineService } from './online.service';
import { RequiresPermissions } from 'src/common/decorators/requires-permissions.decorator';
import { OnlineList } from './dto/req-online.dto';
import { BusinessTypeEnum, Log } from 'src/common/decorators/log.decorator';

@Controller('monitor/online')
export class OnlineController {
  constructor(private readonly onlineService: OnlineService) {}

  @Get('list')
  @RequiresPermissions('monitor:online:query')
  async list(@Query() onlineList: OnlineList) {
    const rows = await this.onlineService.list(onlineList);
    return { rows, total: rows.length };
  }

  /* 强退 */
  @Delete(':tokenKey')
  @RequiresPermissions('monitor:online:forceLogout')
  @Log({
    title: '强退用户',
    businessType: BusinessTypeEnum.force,
  })
  async deletOnline(@Param('tokenKey') tokenKey: string) {
    await this.onlineService.deletOnline(tokenKey);
  }
}
