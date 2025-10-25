import { IntlProvider } from 'react-intl'

import german from '@/lib/i18n/compiled/de-DE.json'
import english from '@/lib/i18n/compiled/en-US.json'
import { type Locale, useLanguageStore } from '@/lib/i18n'
import { ComponentProps } from 'react'

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

const messages: Record<Locale, ComponentProps<typeof IntlProvider>["messages"]> = {
  'de-DE': german,
  'en-US': english,
}
