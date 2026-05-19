"use client";

import { ArrowUp, Check, Menu, PanelRightClose, PanelRightOpen, Share2, X } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

type ArticleReaderShellProps = {
  children: ReactNode;
  sidebar: ReactNode;
  shareTitle: string;
  tocRootId?: string;
};

type TocHeading = {
  id: string;
  text: string;
  level: number;
};

export function ArticleReaderShell({
  children,
  sidebar,
  shareTitle,
  tocRootId,
}: ArticleReaderShellProps) {
  const [wideReading, setWideReading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "done">("idle");
  const [tocHeadings, setTocHeadings] = useState<TocHeading[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const shareTimerRef = useRef<number | null>(null);
  const tocListRef = useRef<HTMLDivElement>(null);
  const tocLinkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const portalRoot = useSyncExternalStore(
    () => () => {},
    () => document.body,
    () => null,
  );

  useEffect(() => {
    return () => {
      if (shareTimerRef.current) {
        window.clearTimeout(shareTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!tocRootId) {
      setTocHeadings([]);
      setActiveHeadingId(null);
      return;
    }

    const root = document.getElementById(tocRootId);

    if (!root) {
      setTocHeadings([]);
      setActiveHeadingId(null);
      return;
    }

    const headings = Array.from(root.querySelectorAll<HTMLElement>("h2,h3,h4,h5,h6"))
      .filter((heading) => heading.id.trim().length > 0)
      .map((heading) => ({
        id: heading.id,
        text: heading.textContent?.trim() ?? "",
        level: Number(heading.tagName.slice(1)),
      }))
      .filter((heading) => heading.text.length > 0);

    setTocHeadings(headings);
    setActiveHeadingId((current) => {
      if (!headings.length) {
        return null;
      }

      if (current && headings.some((heading) => heading.id === current)) {
        return current;
      }

      return headings[0].id;
    });
  }, [tocRootId]);

  useEffect(() => {
    if (!tocHeadings.length) {
      setActiveHeadingId(null);
      return;
    }

    const headings = tocHeadings
      .map((heading) => document.getElementById(heading.id))
      .filter((heading): heading is HTMLElement => heading !== null);

    if (!headings.length) {
      return;
    }

    const updateActiveHeading = () => {
      const activationOffset = 144;
      let nextActiveId = headings[0].id;

      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= activationOffset) {
          nextActiveId = heading.id;
          continue;
        }

        break;
      }

      setActiveHeadingId((current) => (current === nextActiveId ? current : nextActiveId));
    };

    updateActiveHeading();
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [tocHeadings]);

  useEffect(() => {
    if (!activeHeadingId) {
      return;
    }

    const link = tocLinkRefs.current.get(activeHeadingId);
    link?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeHeadingId]);

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

  const minTocLevel = tocHeadings.length
    ? Math.min(...tocHeadings.map((heading) => heading.level))
    : 2;

  const onTocItemClick = (headingId: string) => {
    setActiveHeadingId(headingId);
  };

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

  const readerFabMenu = (
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
          {wideReading ? (
            <PanelRightOpen className="h-5 w-5" />
          ) : (
            <PanelRightClose className="h-5 w-5" />
          )}
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
  );

  return (
    <div className="relative">
      <article
        className={cn(
          "article-reader grid gap-6",
          wideReading ? "xl:grid-cols-1" : "xl:grid-cols-[minmax(0,1fr)_20rem]",
        )}
      >
        <div
          className={cn(
            "min-w-0 space-y-6",
            wideReading && "xl:mx-auto xl:w-full xl:max-w-[78rem]",
          )}
        >
          {children}
        </div>
        <aside
          className={cn(
            "hidden space-y-5 md:block",
            !wideReading && "xl:sticky xl:top-28 xl:self-start",
            wideReading && "md:hidden",
          )}
        >
          {tocHeadings.length ? (
            <section className="glass-panel article-toc rounded-[1.8rem] p-6">
              <h2 className="text-accent-strong font-medium">目录</h2>
              <div ref={tocListRef} className="article-toc__list mt-5">
                {tocHeadings.map((heading) => {
                  const depth = Math.max(0, heading.level - minTocLevel);
                  const isActive = activeHeadingId === heading.id;

                  return (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      ref={(node) => {
                        if (node) {
                          tocLinkRefs.current.set(heading.id, node);
                          return;
                        }

                        tocLinkRefs.current.delete(heading.id);
                      }}
                      data-active={isActive ? "true" : "false"}
                      className="article-toc__item"
                      style={{ "--toc-level": depth } as CSSProperties}
                      onClick={() => onTocItemClick(heading.id)}
                    >
                      {heading.text}
                    </a>
                  );
                })}
              </div>
            </section>
          ) : null}
          {sidebar}
        </aside>
      </article>
      {portalRoot ? createPortal(readerFabMenu, portalRoot) : null}
    </div>
  );
}
