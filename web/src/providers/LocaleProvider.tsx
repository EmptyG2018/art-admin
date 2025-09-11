import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import { LocaleContext, loadLocale } from '@/locales';

const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState('zh-CN');
  const messages = loadLocale(locale).messages;

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};

export default LocaleProvider;
