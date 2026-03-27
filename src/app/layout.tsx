import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import localFont from "next/font/local";
import { Fraunces, Manrope } from "next/font/google";
import { SiteBackground } from "@/components/layout/site-background";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ViewTracker } from "@/components/analytics/view-tracker";
import { ThemeClickFeedback } from "@/components/theme/theme-click-feedback";
import { ColorThemeProvider } from "@/components/theme/color-theme-provider";
import { MusicFloatingPlayer } from "@/components/media/music-floating-player";
import { MusicPlayerProvider } from "@/components/providers/music-player-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { colorPalettes, defaultPalette, paletteStorageKey } from "@/lib/color-themes";
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

const mapleMono = localFont({
  variable: "--font-maple-mono",
  display: "swap",
  src: [
    {
      path: "./fonts/MapleMono[wght]-VF.woff2",
      style: "normal",
      weight: "100 700",
    },
    {
      path: "./fonts/MapleMono-Italic[wght]-VF.woff2",
      style: "italic",
      weight: "100 700",
    },
  ],
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

const paletteIds = colorPalettes.map((palette) => palette.id);
const paletteInitScript = `
(() => {
  const storageKey = ${JSON.stringify(paletteStorageKey)};
  const fallbackPalette = ${JSON.stringify(defaultPalette)};
  const validPalettes = new Set(${JSON.stringify(paletteIds)});

  try {
    const storedPalette = window.localStorage.getItem(storageKey);
    const nextPalette = validPalettes.has(storedPalette) ? storedPalette : fallbackPalette;
    document.documentElement.dataset.palette = nextPalette;
  } catch {
    document.documentElement.dataset.palette = fallbackPalette;
  }

  document.documentElement.dataset.paletteReady = "true";
})();
`;

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
      data-palette-ready="false"
      className={`${manrope.variable} ${fraunces.variable} ${mapleMono.variable} h-full antialiased`}
    >
      <head>
        <Script id="palette-init" strategy="beforeInteractive">
          {paletteInitScript}
        </Script>
        <noscript>
          <style>{`html[data-palette-ready="false"] body { opacity: 1 !important; }`}</style>
        </noscript>
      </head>
      <body className="min-h-full overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ColorThemeProvider>
            <MusicPlayerProvider>
              <div className="relative isolate flex min-h-screen flex-col">
                <SiteBackground />
                <SiteHeader />
                <main className="relative z-10 flex-1 px-5 pt-8 pb-20 sm:px-8 lg:px-10">
                  <div className="mx-auto flex w-full max-w-7xl flex-col gap-12">{children}</div>
                </main>
                <SiteFooter />
              </div>
              <MusicFloatingPlayer />
              <ThemeClickFeedback />
              <ViewTracker />
            </MusicPlayerProvider>
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
