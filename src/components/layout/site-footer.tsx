import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer relative z-10 px-5 pb-8 sm:px-8 lg:px-10">
      <div className="border-border/80 mx-auto max-w-7xl border-t pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-foreground text-sm">
              © {year} {siteConfig.author.name}
            </p>
            <p className="text-muted max-w-2xl text-sm leading-7">{siteConfig.description}</p>
          </div>

          <div className="text-muted flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Link href="/series" className="hover:text-foreground">
              专题
            </Link>
            <Link href="/about" className="hover:text-foreground">
              关于木杉
            </Link>
            <Link href="/rss.xml" className="hover:text-foreground">
              RSS
            </Link>
            <a href={`mailto:${siteConfig.author.email}`} className="hover:text-foreground">
              {siteConfig.author.email}
            </a>
            <Link href={siteConfig.siteUrl} className="hover:text-foreground">
              {new URL(siteConfig.siteUrl).hostname}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
