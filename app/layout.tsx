import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import "@total-typescript/ts-reset";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
