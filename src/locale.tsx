import { createContext, ReactNode, useContext, useLayoutEffect, useState } from 'react';

type Locale = 'en' | 'de';

const localeKey = 'portfolio-locale';
const germanRegions = new Set(['DE', 'AT', 'CH', 'LI', 'LU']);
const germanTimeZones = new Set([
  'Europe/Berlin',
  'Europe/Busingen',
  'Europe/Vienna',
  'Europe/Zurich',
  'Europe/Vaduz',
  'Europe/Luxembourg',
]);

function defaultLocale(): Locale {
  try {
    const saved = window.localStorage.getItem(localeKey);
    if (saved === 'en' || saved === 'de') return saved;
  } catch {
    // The toggle still works for this visit when storage is blocked.
  }

  const preferred = navigator.languages?.[0] || navigator.language || 'en';
  const [language, ...subtags] = preferred.toLowerCase().split('-');
  const region = subtags.find(part => /^[a-z]{2}$/.test(part))?.toUpperCase();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (language === 'de' || (region && germanRegions.has(region)) || germanTimeZones.has(timeZone)) {
    return 'de';
  }
  return 'en';
}

const LocaleContext = createContext({
  locale: 'en' as Locale,
  setLocale: (_locale: Locale) => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState(defaultLocale);

  useLayoutEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(next: Locale) {
    updateLocale(next);
    try {
      window.localStorage.setItem(localeKey, next);
    } catch {
      // The active locale is already set for this visit.
    }
  }

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
