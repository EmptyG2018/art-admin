import storage from 'store';

type Locale = {
  lang: string;
  label: string;
  icon: string;
  title: string;
  messages: () => Promise<any>;
};

type LocaleConfigMap = Record<
  string,
  Locale & {
    antd: () => Promise<any>;
    dayjs: {
      lang: string;
      messages: () => Promise<any>;
    };
  }
>;

const LOCALE = 'locale';

export const locales: LocaleConfigMap = {
  'zh-CN': {
    lang: 'zh-CN',
    label: '简体中文',
    icon: '🇨🇳',
    title: '语言',
    messages: () => import('./zh-CN'),
    antd: () => import('antd/locale/zh_CN'),
    dayjs: {
      lang: 'zh-cn',
      messages: () => import('dayjs/locale/zh-cn'),
    },
  },
  'zh-TW': {
    lang: 'zh-TW',
    label: '繁體中文',
    icon: '🇭🇰',
    title: '語言',
    messages: () => import('./zh-TW'),
    antd: () => import('antd/locale/zh_TW'),
    dayjs: {
      lang: 'zh-tw',
      messages: () => import('dayjs/locale/zh-tw'),
    },
  },
  'en-US': {
    lang: 'en-US',
    label: 'English',
    icon: '🇺🇸',
    title: 'Language',
    messages: () => import('./en-US'),
    antd: () => import('antd/locale/en_US'),
    dayjs: {
      lang: 'en',
      messages: () => import('dayjs/locale/en'),
    },
  },
};

export const getLang = () => {
  const lang = navigator.cookieEnabled && storage.get(LOCALE);
  let browserLang;
  const isNavigatorLanguageValid =
    typeof navigator !== 'undefined' && typeof navigator.language === 'string';
  browserLang = isNavigatorLanguageValid
    ? navigator.language.split('-').join('-')
    : '';
  return lang || browserLang || 'zh-CN';
};

export const changeLocale = (locale: string) => {
  storage.set(LOCALE, locale);
  window.location.reload();
};

export const getLocales = () =>
  Object.keys(locales).map((lang) => locales[lang]);
