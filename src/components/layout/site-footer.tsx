import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 px-5 pb-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl border-t border-border/80 pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-foreground">
              © {year} {siteConfig.author.name}
            </p>
            <p className="max-w-2xl text-sm leading-7 text-muted">{siteConfig.description}</p>
            <p className="text-xs leading-6 text-muted">
              静态生成于 Next.js，内容本地维护，保留 RSS 订阅与阅读体验优化。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
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
