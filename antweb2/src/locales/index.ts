import { createContext } from "react";
import zhCN from "./zh-CN";
import zhTW from "./zh-TW";
import enUS from "./en-US";

type LocaleConfigMap = Record<
  string,
  {
    lang: string;
    label: string;
    icon: string;
    title: string;
    messages: Record<string, string>;
  }
>;

const localeConfigMap: LocaleConfigMap = {
  "zh-CN": {
    lang: "zh-CN",
    label: "简体中文",
    icon: "🇨🇳",
    title: "语言",
    messages: zhCN,
  },
  "zh-TW": {
    lang: "zh-TW",
    label: "繁體中文",
    icon: "🇭🇰",
    title: "語言",
    messages: zhTW,
  },
  "en-US": {
    lang: "en-US",
    label: "English",
    icon: "🇺🇸",
    title: "Language",
    messages: enUS,
  },
};

export const getLocales = () =>
  Object.keys(localeConfigMap).map((locale) => localeConfigMap[locale]);

export const loadLocale = (locale: string) => {
  return localeConfigMap[locale] || localeConfigMap["zh-CN"];
};

export const LocaleContext = createContext({
  locale: "zh-CN",
  changeLocale: (_: string) => {},
});
