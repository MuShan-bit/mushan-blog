"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteMobileNav } from "@/components/layout/site-mobile-nav";
import { SiteNavTabs } from "@/components/layout/site-nav-tabs";
import { AppearanceSwitcher } from "@/components/theme/appearance-switcher";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let frameId = 0;

    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY <= 12) {
        setVisible((current) => (current ? current : true));
      } else if (delta > 10) {
        setVisible((current) => (current ? false : current));
      } else if (delta < -10) {
        setVisible((current) => (current ? current : true));
      }

      lastScrollY = currentScrollY;
      frameId = 0;
    };

    const onScroll = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(updateVisibility);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className={cn("site-header sticky top-0 z-40 px-5 pt-5 sm:px-8 lg:px-10", visible ? "site-header--visible" : "site-header--hidden")}>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4 rounded-[2rem] border border-border bg-surface/90 px-4 py-3 shadow-[0_18px_60px_rgba(17,34,28,0.08)] backdrop-blur-2xl sm:px-6">
          <Link href="/" className="group hidden min-w-0 items-center gap-3 lg:flex">
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

          <div className="flex min-w-0 items-center gap-3 lg:hidden">
            <SiteMobileNav />
            <Link href="/" className="min-w-0">
              <p className="truncate font-display text-base font-semibold tracking-[-0.04em] text-foreground sm:text-lg">
                木杉的风与代码
              </p>
              <p className="truncate text-xs text-muted">风、代码、影像与作品</p>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <SiteNavTabs />
            <AppearanceSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
