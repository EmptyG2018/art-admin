import React, { useState, StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  RawIntlProvider,
  createIntl,
  createIntlCache,
  IntlShape,
} from 'react-intl';
import {
  App as AntdContext,
  ConfigProvider as AntdProvier,
  ConfigProviderProps,
} from 'antd';
import { getLang, locales } from './locales';
import AppRoutes from './routes';
import dayjs from 'dayjs';
import './App.css';

type Locale = ConfigProviderProps['locale'];

function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>();
  const [intl, setIntl] = useState<IntlShape>();

  useEffect(() => {
    const lang = getLang();
    const locale = locales[lang] || locales['zh-CN'];

    // 加载 dayjs 语言包
    locale.dayjs.messages().then(() => {
      dayjs.locale(locale.dayjs.lang);
    });

    // 加载 antd 语言包
    locale.antd().then((messages) => {
      setLocale(messages.default);
    });

    // 加载 app 语言包
    locale.messages().then((messages) => {
      setIntl(
        createIntl(
          {
            locale: lang,
            messages: messages.default,
          },
          createIntlCache(),
        ),
      );
    });
  }, []);

  if (!intl || !locale) return;

  return (
    <AntdProvier locale={locale}>
      <AntdContext>
        <RawIntlProvider value={intl}>{children}</RawIntlProvider>
      </AntdContext>
    </AntdProvier>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </StrictMode>,
);
