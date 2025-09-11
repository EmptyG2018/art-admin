/*
 * @Author: sheng.jiang 491623426@qq.com
 * @Date: 2023-06-30 08:34:42
 * @LastEditors: hu.chao 491623426@qq.com
 * @LastEditTime: 2024-05-18 11:57:42
 * @FilePath: /meimei-new-vue/vite/plugins/index.js
 * @Description: 
 * 
 */
import vue from '@vitejs/plugin-vue'
import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
import vueJsx from '@vitejs/plugin-vue-jsx'
export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [vue()]
  vitePlugins.push(vueJsx())
  vitePlugins.push(createAutoImport())
  vitePlugins.push(createSetupExtend())
  vitePlugins.push(createSvgIcon(isBuild))
  isBuild && vitePlugins.push(...createCompression(viteEnv))
  return vitePlugins
}
