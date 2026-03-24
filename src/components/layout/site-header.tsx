import Link from "next/link";
import { SiteNavTabs } from "@/components/layout/site-nav-tabs";
import { AppearanceSwitcher } from "@/components/theme/appearance-switcher";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 px-5 pt-5 sm:px-8 lg:px-10">
      <div className="interactive-panel mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[2rem] border border-border bg-surface/90 px-4 py-3 shadow-[0_18px_60px_rgba(17,34,28,0.08)] backdrop-blur-2xl sm:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-sm font-semibold text-accent-strong transition duration-300 group-hover:scale-[1.06] group-hover:bg-accent/18">
            木杉
          </div>
          <div className="min-w-0">
            <p className="font-display truncate text-lg font-semibold tracking-[-0.03em] text-foreground transition duration-300 group-hover:text-accent-strong">
              木杉的风与代码
            </p>
            <p className="truncate text-sm text-muted">内容优先，设计留白，偶尔有一些流动感。</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <SiteNavTabs />
          <AppearanceSwitcher />
        </div>
      </div>
    </header>
  );
}
