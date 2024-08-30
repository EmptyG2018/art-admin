import React, { useState, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { RouterProvider } from 'react-router-dom';
import { Provider as StoreProvider } from 'react-redux';
import stores from '@/stores';
import routes from './routes';
import { LocaleContext, loadLocale } from './locales';
import './App.css';

function LocaleProvider({ children }: { children: React.ReactNode }) {
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
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <StoreProvider store={stores}>
        <RouterProvider router={routes} />
      </StoreProvider>
    </LocaleProvider>
  </StrictMode>,
);
