import { create } from "zustand";
import { persist } from "zustand/middleware";

export const LOCALES = ["en-US", "de-DE"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en-US";

const BROWSER_LANGUAGES: Record<string, Locale> = {
  en: "en-US",
  de: "de-DE",
} as const;

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
        return set({ locale: validLocale });
      },
    }),
    {
      name: "language-storage",
    }
  )
);
