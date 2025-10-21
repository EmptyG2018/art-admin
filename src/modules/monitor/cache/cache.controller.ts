import { Controller, Delete, Get, Param } from '@nestjs/common';
import { CacheService } from './cache.service';
import { DataObj } from 'src/common/class/data-obj.class';

@Controller('monitor/cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Get()
  async getRedisInfo() {
    const redisInfo = await this.cacheService.getRedisInfo();
    return DataObj.create(redisInfo);
  }

  @Get('getNames')
  async getNames() {
    return this.cacheService.getNames();
  }

  @Get('getKeys/:cacheName')
  async getKeys(@Param('cacheName') cacheName: string) {
    return this.cacheService.getKeys(cacheName);
  }

  @Get('getValue/:name/:key')
  async getValue(@Param('name') name: string, @Param('key') key: string) {
    const data = await this.cacheService.getValue(name, key);
    return DataObj.create(data);
  }

  @Delete('deleteCacheName/:cacheName')
  async deleteCacheName(@Param('cacheName') cacheName: string) {
    return this.cacheService.deleteCacheName(cacheName);
  }

  @Delete('deleteCacheKey/:key')
  async deleteCacheKey(@Param('key') key: string) {
    return this.cacheService.deleteCacheKey(key);
  }

  @Delete('clearCacheAll')
  async clearCacheAll() {
    return this.cacheService.clearCacheAll();
  }
}
