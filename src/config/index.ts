/*
 * @Author: hu.chao 491623426@qq.com
 * @Date: 2024-04-22 19:22:42
 * @LastEditors: hu.chao 491623426@qq.com
 * @LastEditTime: 2024-04-22 21:13:53
 * @FilePath: /art-template/src/config/index.ts
 * @Description: 环境变量入口
 * 
 */
/**
 * 导出配置文件
 */
export default () => {
  let config = null;
  if (isDev()) {
    config = require('./config.dev').default;
  } else {
    config = require('./config.pro').default;
  }
  return config;
};

/**
 * 判断是不是开发环境
 * @returns
 */
export function isDev(): Boolean {
  return process.env.NODE_ENV === 'development';
}
