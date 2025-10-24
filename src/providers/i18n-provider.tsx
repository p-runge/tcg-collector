import { IntlProvider, defineMessages } from 'react-intl'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import german from '@/lib/i18n/compiled/de-DE.json'
import english from '@/lib/i18n/compiled/en-US.json'

export default function I18nProvider({
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

const messages = {
  'de-DE': german,
  'en-US': english,
}

export type Locale = keyof typeof messages

export const BROWSER_LANGUAGES: Record<string, Locale> = {
  en: 'en-US',
  de: 'de-DE',
} as const

export const languages = defineMessages<Locale, Record<string, string>>({
  ['en-US']: {
    id: 'language.en',
    defaultMessage: 'English',
  },
  ['de-DE']: {
    id: 'language.de',
    defaultMessage: 'German',
  },
})

function getInitialLocale() {
  const browserLocale = navigator.language.split('_')[0]!
  return BROWSER_LANGUAGES[browserLocale] || 'en-US'
}

type LanguageState = {
  locale: Locale
  setLocale: (locale?: Locale | 'auto') => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: getInitialLocale(),
      setLocale: (locale) => {
        const validLocale =
          !locale || locale === 'auto' ? getInitialLocale() : locale
        document.documentElement.lang = validLocale.substring(0, 2)
        return set({ locale: validLocale })
      },
    }),
    {
      name: 'language-storage',
    },
  ),
)
