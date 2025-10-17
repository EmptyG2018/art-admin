import layout from './zh-TW/layout';
import component from './zh-TW/component';
import menu from './zh-TW/menu';
import pages from './zh-TW/pages';
import settings from './zh-TW/settings';
import dict from './zh-TW/dict';

export default {
  'app.tools.fullscreen.on': '進入全螢幕',
  'app.tools.fullscreen.off': '退出全螢幕',
  'app.tools.fullscreen.unsupport': '目前瀏覽器不支援全螢幕功能',
  'app.tools.fullscreen.on.error': '進入全螢幕失敗：',
  'app.tools.fullscreen.off.error': '退出全螢幕失敗：',
  ...pages,
  ...menu,
  ...settings,
  ...layout,
  ...component,
  ...dict,
};
