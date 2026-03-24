import Link from "next/link";
import { Rss } from "lucide-react";
import { AppearanceSwitcher } from "@/components/theme/appearance-switcher";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 px-5 pt-5 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[2rem] border border-border bg-surface/90 px-4 py-3 shadow-[0_18px_60px_rgba(17,34,28,0.08)] backdrop-blur-2xl sm:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-sm font-semibold text-accent-strong">
            木杉
          </div>
          <div className="min-w-0">
            <p className="font-display truncate text-lg font-semibold tracking-[-0.03em] text-foreground">
              木杉的风与代码
            </p>
            <p className="truncate text-sm text-muted">内容优先，设计留白，偶尔有一些流动感。</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-2 lg:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm text-muted",
                  "hover:bg-accent-soft hover:text-accent-strong",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/rss.xml"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted hover:bg-accent-soft hover:text-accent-strong"
            >
              <Rss className="h-4 w-4" />
              RSS
            </Link>
          </nav>
          <AppearanceSwitcher />
        </div>
      </div>
    </header>
  );
}
