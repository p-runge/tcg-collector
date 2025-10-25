"use client"

import { BROWSER_LANGUAGES, Locale, messages } from '@/lib/i18n';
import { IntlProvider } from 'react-intl';
import { create } from "zustand";
import { persist } from "zustand/middleware";

export function I18nProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = useLanguageStore((state) => state.locale)

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </IntlProvider>
  )
}


function getInitialLocale() {
  const browserLocale = navigator.language.split("_")[0]!;
  return BROWSER_LANGUAGES[browserLocale] || "en-US";
}

type LanguageState = {
  locale: Locale;
  setLocale: (locale?: Locale | "auto") => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: getInitialLocale(),
      setLocale: (locale) => {
        const validLocale =
          !locale || locale === "auto" ? getInitialLocale() : locale;
        document.documentElement.lang = validLocale.substring(0, 2);

        // used for server-side rendering to detect preferred locale
        document.cookie = `preferred-locale=${locale}; path=/`;

        return set({ locale: validLocale });
      },
    }),
    {
      name: "language-storage",
    }
  )
);
