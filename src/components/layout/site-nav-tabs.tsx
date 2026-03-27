"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  return (
    <nav className="hidden items-center gap-2 lg:flex">
      {siteConfig.nav.map((item) => {
        const isActive = isActivePath(pathname, item.href);
        const isPending = pendingHref === item.href && !isActive;

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
              "tab-link text-muted rounded-full px-4 py-2 text-sm",
              "hover:bg-accent-soft hover:text-accent-strong",
              isPending && "tab-link--pending",
              isActive && "tab-link--active bg-accent-soft text-accent-strong",
            )}
          >
            {isActive ? <TabAccentIcon palette={palette} /> : null}
            <span>{item.label}</span>
            {isPending ? <span className="tab-link__pending" aria-hidden="true" /> : null}
          </Link>
        );
      })}
    </nav>
  );
}
