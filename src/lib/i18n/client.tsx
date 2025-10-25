"use client"

import { BROWSER_LANGUAGES, DEFAULT_LOCALE, Locale, messages } from '@/lib/i18n';
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
    <IntlProvider locale={locale} messages={messages[locale]} defaultLocale={DEFAULT_LOCALE} onError={(error) => {
      if (error.code === 'MISSING_TRANSLATION') {
        // Suppress missing translation errors
        return;
      }

      console.error(error);
    }}>
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

        set({ locale: validLocale });

        // Trigger a page reload to re-render server components
        window.location.reload();
      },
    }),
    {
      name: "language-storage",
    }
  )
);
