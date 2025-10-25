"use client"

import { useLanguageStore } from "@/lib/i18n";

export default function HTML({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguageStore();
  const lang = locale.split("-")[0]!;

  return (
    <html lang={lang} suppressHydrationWarning>
      {children}
    </html>
  );
}
