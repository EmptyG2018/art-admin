import component from "./zh-CN/component";
import globalHeader from "./zh-CN/globalHeader";
import menu from "./zh-CN/menu";
import pages from "./zh-CN/pages";
import settingDrawer from "./zh-CN/settingDrawer";
import settings from "./zh-CN/settings";

export default {
  "navBar.lang": "語言",
  "layout.user.link.help": "幫助",
  "layout.user.link.privacy": "隱私",
  "layout.user.link.terms": "條款",
  "app.preview.down.block": "下載此頁面到本地項目",
  "app.welcome.link.fetch-blocks": "獲取全部區塊",
  "app.welcome.link.block-list": "基於 block 開發，快速構建標準頁面",
  ...pages,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...component,
};
