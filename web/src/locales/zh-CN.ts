import layout from './zh-CN/layout';
import component from './zh-CN/component';
import menu from './zh-CN/menu';
import pages from './zh-CN/pages';
import settings from './zh-CN/settings';
import dict from './zh-CN/dict';

export default {
  'app.tools.fullscreen.on': '进入全屏',
  'app.tools.fullscreen.off': '退出全屏',
  'app.tools.fullscreen.unsupport': '当前浏览器不支持全屏功能',
  'app.tools.fullscreen.on.error': '进入全屏失败：',
  'app.tools.fullscreen.off.error': '退出全屏失败：',
  ...pages,
  ...menu,
  ...settings,
  ...layout,
  ...component,
  ...dict,
};
