"use client";

import Link from "next/link";
import { BookOpenText, Camera, House, Layers3, Rss, UserRound, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

type MobileNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

const mobileNavItems: MobileNavItem[] = [
  { href: "/", label: "首页", icon: House },
  { href: "/blog", label: "文章", icon: BookOpenText },
  { href: "/portfolio", label: "作品集", icon: Layers3 },
  { href: "/gallery", label: "相册", icon: Camera },
  { href: "/friends", label: "友联", icon: Users },
  { href: "/about", label: "关于木杉", icon: UserRound },
  { href: "/rss.xml", label: "RSS", icon: Rss, exact: true },
];

export function SiteMobileNav() {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const currentItem =
    mobileNavItems.find((item) => (item.exact ? pathname === item.href : isActivePath(pathname, item.href))) ??
    mobileNavItems[0];

  return (
    <div className="mobile-nav-bar glass-panel lg:hidden">
      <div className="flex items-center justify-between gap-3 px-1 pb-2">
        <p className="section-kicker text-[0.68rem] font-semibold">Mobile Navigation</p>
        <p className="text-xs text-muted">
          当前 · <span className="text-accent-strong">{currentItem.label}</span>
        </p>
      </div>

      <div className="mobile-nav-bar__scroller no-scrollbar">
        {mobileNavItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : isActivePath(pathname, item.href);
          const isPending = pendingHref === item.href && !isActive;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              aria-busy={isPending || undefined}
              onClick={(event) => {
                if (
                  isActive ||
                  event.defaultPrevented ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                ) {
                  return;
                }

                setPendingHref(item.href);
              }}
              className={cn(
                "mobile-nav-link",
                isActive && "mobile-nav-link--active",
                isPending && "mobile-nav-link--pending",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
              {isPending ? <span className="mobile-nav-link__pending-dot" aria-hidden="true" /> : null}
            </Link>
          );
        })}
      </div>

      <p className="mt-2 px-1 text-[0.78rem] leading-6 text-muted">
        {siteConfig.name} 的主导航会固定在这里，拇指可以直接滑动切换栏目。
      </p>
    </div>
  );
}
