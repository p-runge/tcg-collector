import { headers } from "next/headers";
import { createIntl } from "react-intl";
import {
  BROWSER_LANGUAGES,
  DEFAULT_LOCALE,
  Locale,
  LOCALES,
  messages,
} from ".";

export async function getIntl() {
  let locale: Locale;

  const acceptLanguage = (await headers()).get("accept-language") || "";
  const headerLocale = acceptLanguage;
  const languageCode = headerLocale.split("-")[0]!;
  if (LOCALES.includes(headerLocale)) {
    // exact match
    locale = headerLocale as Locale;
  } else if (BROWSER_LANGUAGES[languageCode]) {
    // matches core language code -> use mapped locale
    locale = BROWSER_LANGUAGES[languageCode]! as Locale;
  } else {
    // fallback to default locale
    locale = DEFAULT_LOCALE;
  }

  return createIntl({
    locale,
    messages: messages[locale],
  });
}
