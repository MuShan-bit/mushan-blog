"use client";

import Link from "next/link";
import { Rss } from "lucide-react";
import { usePathname } from "next/navigation";
import { TabAccentIcon } from "@/components/layout/tab-accent-icon";
import { useColorPalette } from "@/components/theme/use-color-palette";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavTabs() {
  const pathname = usePathname();
  const palette = useColorPalette();

  return (
    <nav className="hidden items-center gap-2 lg:flex">
      {siteConfig.nav.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "tab-link rounded-full px-4 py-2 text-sm text-muted",
              "hover:bg-accent-soft hover:text-accent-strong",
              isActive && "tab-link--active bg-accent-soft text-accent-strong",
            )}
          >
            {isActive ? <TabAccentIcon palette={palette} /> : null}
            <span>{item.label}</span>
          </Link>
        );
      })}
      <Link
        href="/rss.xml"
        className="rounded-full px-4 py-2 text-sm text-muted hover:bg-accent-soft hover:text-accent-strong"
      >
        <span className="inline-flex items-center gap-2">
          <Rss className="h-4 w-4" />
          RSS
        </span>
      </Link>
    </nav>
  );
}
