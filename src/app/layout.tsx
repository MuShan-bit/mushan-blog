import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Manrope, Space_Mono } from "next/font/google";
import { SiteBackground } from "@/components/layout/site-background";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ViewTracker } from "@/components/analytics/view-tracker";
import { ColorThemeProvider } from "@/components/theme/color-theme-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.title,
  alternates: {
    types: {
      "application/rss+xml": `${siteConfig.siteUrl}/rss.xml`,
    },
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.title,
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      data-palette="verdant"
      className={`${manrope.variable} ${fraunces.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ColorThemeProvider>
            <div className="relative isolate flex min-h-screen flex-col">
              <SiteBackground />
              <SiteHeader />
              <main className="relative z-10 flex-1 px-5 pb-20 pt-8 sm:px-8 lg:px-10">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-12">{children}</div>
              </main>
              <SiteFooter />
            </div>
            <ViewTracker />
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
