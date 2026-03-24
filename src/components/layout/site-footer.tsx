import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative z-10 px-5 pb-8 sm:px-8 lg:px-10">
      <div className="interactive-panel mx-auto flex max-w-7xl flex-col gap-4 rounded-[2rem] border border-border bg-surface/70 px-6 py-6 backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl font-semibold text-foreground">{siteConfig.title}</p>
          <p className="mt-1 max-w-2xl text-sm leading-7 text-muted">
            用 Next.js 搭建的中文个人博客，承载文章、作品、相册、友联与关于页展示。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          <Link href="/blog" className="rounded-full px-2 py-1 hover:text-foreground">
            文章
          </Link>
          <Link href="/portfolio" className="rounded-full px-2 py-1 hover:text-foreground">
            作品集
          </Link>
          <Link href="/gallery" className="rounded-full px-2 py-1 hover:text-foreground">
            相册
          </Link>
          <Link href="/friends" className="rounded-full px-2 py-1 hover:text-foreground">
            友联
          </Link>
          <Link href="/rss.xml" className="rounded-full px-2 py-1 hover:text-foreground">
            RSS
          </Link>
        </div>
      </div>
    </footer>
  );
}
