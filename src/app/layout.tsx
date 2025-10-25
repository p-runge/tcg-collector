import HTML from "@/components/html";
import { TRPCReactProvider } from "@/lib/api/react";
import { I18nProvider } from "@/lib/i18n/client";
import { ThemeProvider } from "@/providers/theme-provider";
import "@total-typescript/ts-reset";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import type React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "TCG Collector",
  description: "The easiest way to track your Pokémon card collection",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HTML>
      <body>
        <PlausibleProvider domain="tcg.p6.gg">
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <I18nProvider>{children}</I18nProvider>
            </ThemeProvider>
          </TRPCReactProvider>
        </PlausibleProvider>
        <SpeedInsights />
      </body>
    </HTML>
  );
}
