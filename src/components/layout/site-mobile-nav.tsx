"use client";

import Link from "next/link";
import { BookOpenText, Camera, House, Layers3, Menu, Rss, UserRound, Users, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

type MobileMenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  exact?: boolean;
};

const mobileMenuItems: MobileMenuItem[] = [
  { href: "/", label: "首页", icon: House, description: "回到内容入口与站点总览。", exact: true },
  { href: "/blog", label: "文章", icon: BookOpenText, description: "技术、设计、摄影与长期记录。" },
  { href: "/portfolio", label: "作品集", icon: Layers3, description: "项目背景、过程、成果与技术栈。" },
  { href: "/gallery", label: "相册", icon: Camera, description: "按主题展开的影像与摄影记录。" },
  { href: "/friends", label: "友链", icon: Users, description: "喜欢的独立站点与朋友博客。" },
  { href: "/about", label: "关于木杉", icon: UserRound, description: "技能、兴趣与个人叙事页面。" },
  { href: "/rss.xml", label: "RSS", icon: Rss, description: "订阅最新文章更新。", exact: true },
];

export function SiteMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const portalRoot = typeof document === "undefined" ? null : document.body;

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const currentItem =
    mobileMenuItems.find((item) => (item.exact ? pathname === item.href : isActivePath(pathname, item.href))) ??
    mobileMenuItems[0];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mobile-menu-trigger lg:hidden"
        aria-label="打开站点菜单"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && portalRoot
        ? createPortal(
            <div
              className="mobile-menu-backdrop lg:hidden"
              onClick={() => setOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label="站点侧边菜单"
            >
              <aside className="mobile-menu-panel" onClick={(event) => event.stopPropagation()}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <p className="section-kicker text-[0.68rem] font-semibold">Site Menu</p>
                    <div>
                      <p className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
                        {siteConfig.title}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-muted">
                        现在在 <span className="font-medium text-accent-strong">{currentItem.label}</span>，可以从这里快速切到其它栏目。
                      </p>
                    </div>
                  </div>

                  <button type="button" onClick={() => setOpen(false)} className="mobile-menu-close" aria-label="关闭菜单">
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="mt-6 grid gap-2">
                  {mobileMenuItems.map((item) => {
                    const isActive = item.exact ? pathname === item.href : isActivePath(pathname, item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={cn("mobile-menu-link", isActive && "mobile-menu-link--active")}
                      >
                        <span className="mobile-menu-link__icon">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-foreground">{item.label}</span>
                          <span className="mt-1 block text-xs leading-6 text-muted">{item.description}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </aside>
            </div>,
            portalRoot,
          )
        : null}
    </>
  );
}
