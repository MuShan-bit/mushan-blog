"use client";

import type { ReactNode } from "react";
import { ArrowUp, Check, Menu, PanelRightClose, PanelRightOpen, Share2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type ArticleReaderShellProps = {
  children: ReactNode;
  sidebar: ReactNode;
  shareTitle: string;
};

export function ArticleReaderShell({ children, sidebar, shareTitle }: ArticleReaderShellProps) {
  const [wideReading, setWideReading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "done">("idle");
  const menuRef = useRef<HTMLDivElement>(null);
  const shareTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (shareTimerRef.current) {
        window.clearTimeout(shareTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current?.contains(event.target as Node)) {
        return;
      }

      setMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    setMenuOpen(false);
  };

  const sharePage = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareTitle,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setMenuOpen(false);
        return;
      }

      try {
        await navigator.clipboard.writeText(url);
      } catch {
        setMenuOpen(false);
        return;
      }
    }

    if (shareTimerRef.current) {
      window.clearTimeout(shareTimerRef.current);
    }

    setShareState("done");
    setMenuOpen(false);
    shareTimerRef.current = window.setTimeout(() => {
      setShareState("idle");
      shareTimerRef.current = null;
    }, 2000);
  };

  return (
    <div className="relative">
      <article className={cn("article-reader grid gap-6", wideReading ? "xl:grid-cols-1" : "xl:grid-cols-[minmax(0,1fr)_20rem]")}>
        <div className={cn("min-w-0 space-y-6", wideReading && "xl:mx-auto xl:w-full xl:max-w-[78rem]")}>{children}</div>
        <aside
          className={cn(
            "hidden space-y-5 md:block",
            !wideReading && "xl:sticky xl:top-28 xl:self-start",
            wideReading && "md:hidden",
          )}
        >
          {sidebar}
        </aside>
      </article>

      <div ref={menuRef} className="reader-fab-stack" data-open={menuOpen}>
        <div className="reader-fab-actions">
          <button
            type="button"
            onClick={sharePage}
            className={cn("reader-fab", shareState === "done" && "reader-fab--active")}
            aria-label={shareState === "done" ? "链接已分享" : "分享当前页面"}
            title={shareState === "done" ? "链接已分享" : "分享当前页面"}
          >
            {shareState === "done" ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={scrollToTop}
            className="reader-fab"
            aria-label="回到顶部"
            title="回到顶部"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setWideReading((current) => !current);
              setMenuOpen(false);
            }}
            className={cn("reader-fab hidden md:inline-flex", wideReading && "reader-fab--active")}
            aria-label={wideReading ? "退出宽屏阅读" : "开启宽屏阅读"}
            aria-pressed={wideReading}
            title={wideReading ? "退出宽屏阅读" : "开启宽屏阅读"}
          >
            {wideReading ? <PanelRightOpen className="h-5 w-5" /> : <PanelRightClose className="h-5 w-5" />}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className={cn("reader-fab reader-fab--menu", menuOpen && "reader-fab--active")}
          aria-label={menuOpen ? "关闭阅读快捷菜单" : "打开阅读快捷菜单"}
          aria-expanded={menuOpen}
          title={menuOpen ? "关闭阅读快捷菜单" : "打开阅读快捷菜单"}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
