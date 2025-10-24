import { TRPCReactProvider } from "@/lib/api/react";
import "@total-typescript/ts-reset";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import type React from "react";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <PlausibleProvider domain="tcg.p6.gg">
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </TRPCReactProvider>
        </PlausibleProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
