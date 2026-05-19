"use client";

import {
  ArrowUp,
  Check,
  Menu,
  PanelRightClose,
  PanelRightOpen,
  Share2,
  X,
} from "lucide-react";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
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

type TocNode = TocHeading & {
  parentId: string | null;
  depth: number;
  children: TocNode[];
};

type TocTreeResult = {
  roots: TocNode[];
  parentById: Record<string, string | null>;
};

function buildTocTree(headings: TocHeading[]): TocTreeResult {
  const roots: TocNode[] = [];
  const stack: TocNode[] = [];
  const parentById: Record<string, string | null> = {};

  for (const heading of headings) {
    const node: TocNode = {
      ...heading,
      parentId: null,
      depth: 0,
      children: [],
    };

    while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
      stack.pop();
    }

    const parent = stack[stack.length - 1] ?? null;

    if (parent) {
      node.parentId = parent.id;
      node.depth = parent.depth + 1;
      parent.children.push(node);
    } else {
      roots.push(node);
    }

    parentById[node.id] = node.parentId;
    stack.push(node);
  }

  return {
    roots,
    parentById,
  };
}

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
  const [tocTree, setTocTree] = useState<TocNode[]>([]);
  const [tocParentsById, setTocParentsById] = useState<Record<string, string | null>>({});
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const shareTimerRef = useRef<number | null>(null);
  const tocListRef = useRef<HTMLDivElement>(null);
  const tocLinkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const tocNavigationLockRef = useRef<{ headingId: string; expiresAt: number } | null>(null);
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
      setTocTree([]);
      setTocParentsById({});
      tocNavigationLockRef.current = null;
      setActiveHeadingId(null);
      return;
    }

    const root = document.getElementById(tocRootId);

    if (!root) {
      setTocHeadings([]);
      setTocTree([]);
      setTocParentsById({});
      tocNavigationLockRef.current = null;
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

    const { roots, parentById } = buildTocTree(headings);
    setTocHeadings(headings);
    setTocTree(roots);
    setTocParentsById(parentById);
    tocNavigationLockRef.current = null;
    setActiveHeadingId(null);
  }, [tocRootId]);

  useEffect(() => {
    if (!activeHeadingId) {
      return;
    }

    const link = tocLinkRefs.current.get(activeHeadingId);
    link?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeHeadingId]);

  useEffect(() => {
    if (!tocHeadings.length) {
      setActiveHeadingId(null);
      return;
    }

    const headingElements = tocHeadings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element instanceof HTMLElement);

    if (!headingElements.length) {
      setActiveHeadingId(null);
      return;
    }

    let frameId = 0;

    const updateActiveHeadingByScroll = () => {
      const headerShell = document.querySelector<HTMLElement>(".site-header__shell");
      const headerOffset = (headerShell?.getBoundingClientRect().height ?? 72) + 34;
      const snapBuffer = 22;

      const navigationLock = tocNavigationLockRef.current;

      if (navigationLock) {
        const targetHeading = document.getElementById(navigationLock.headingId);
        const targetHeadingTop = targetHeading?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
        const reachedTarget = Math.abs(targetHeadingTop - headerOffset) <= 18 || targetHeadingTop < headerOffset + 8;
        const expired = performance.now() >= navigationLock.expiresAt;

        if (!reachedTarget && !expired) {
          setActiveHeadingId((current) =>
            current === navigationLock.headingId ? current : navigationLock.headingId,
          );
          frameId = 0;
          return;
        }

        tocNavigationLockRef.current = null;
      }

      let nextActiveId = headingElements[0].id;

      for (let index = 0; index < headingElements.length; index += 1) {
        const element = headingElements[index];
        const headingTop = element.getBoundingClientRect().top;

        if (headingTop <= headerOffset) {
          nextActiveId = element.id;
          continue;
        }

        if (headingTop - headerOffset <= snapBuffer) {
          nextActiveId = element.id;
        }

        break;
      }

      setActiveHeadingId((current) => (current === nextActiveId ? current : nextActiveId));
      frameId = 0;
    };

    const onScroll = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(updateActiveHeadingByScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateActiveHeadingByScroll();

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [tocHeadings]);

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

  const activeHeadingPath = new Set<string>();

  if (activeHeadingId) {
    let cursor: string | null = activeHeadingId;

    while (cursor) {
      activeHeadingPath.add(cursor);
      cursor = tocParentsById[cursor] ?? null;
    }
  }

  const onTocItemClick = (event: MouseEvent<HTMLAnchorElement>, headingId: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
      return;
    }

    event.preventDefault();
    tocNavigationLockRef.current = {
      headingId,
      expiresAt: performance.now() + 480,
    };
    setActiveHeadingId(headingId);

    const targetHeading = document.getElementById(headingId);

    if (targetHeading) {
      const htmlElement = document.documentElement;
      const previousScrollBehavior = htmlElement.style.scrollBehavior;
      htmlElement.style.scrollBehavior = "auto";

      const headerShell = document.querySelector<HTMLElement>(".site-header__shell");
      const headerOffset = (headerShell?.getBoundingClientRect().height ?? 72) + 34;
      const targetY = Math.max(
        0,
        window.scrollY + targetHeading.getBoundingClientRect().top - headerOffset,
      );

      window.scrollTo({ top: targetY, behavior: "auto" });
      window.requestAnimationFrame(() => {
        htmlElement.style.scrollBehavior = previousScrollBehavior;
      });
    }

    window.history.replaceState(null, "", `#${headingId}`);
  };

  const renderTocNodes = (nodes: TocNode[]) => {
    return nodes.map((node) => {
      const hasChildren = node.children.length > 0;
      const isActive = activeHeadingId === node.id;
      const isExpanded = hasChildren && activeHeadingPath.has(node.id);

      return (
        <div key={node.id} className="article-toc__node" style={{ "--toc-level": node.depth } as CSSProperties}>
          <div className="article-toc__row" data-active={isActive ? "true" : "false"}>
            <a
              href={`#${node.id}`}
              ref={(linkNode) => {
                if (linkNode) {
                  tocLinkRefs.current.set(node.id, linkNode);
                  return;
                }

                tocLinkRefs.current.delete(node.id);
              }}
              data-active={isActive ? "true" : "false"}
              className="article-toc__item"
              onClick={(event) => onTocItemClick(event, node.id)}
            >
              {node.text}
            </a>
          </div>
          {hasChildren && isExpanded ? (
            <div className="article-toc__children">{renderTocNodes(node.children)}</div>
          ) : null}
        </div>
      );
    });
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
          className={cn("reader-fab hidden lg:inline-flex", wideReading && "reader-fab--active")}
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
          wideReading ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_20rem]",
        )}
      >
        <div
          className={cn(
            "min-w-0 space-y-6",
            wideReading && "lg:mx-auto lg:w-full lg:max-w-[78rem]",
          )}
        >
          {children}
        </div>
        <aside
          className={cn(
            "hidden space-y-5 md:block",
            !wideReading && "lg:sticky lg:top-28 lg:self-start",
            wideReading && "lg:hidden",
          )}
        >
          {tocHeadings.length ? (
            <section className="glass-panel article-toc rounded-[1.8rem] p-6">
              <h2 className="text-accent-strong font-medium">目录</h2>
              <div ref={tocListRef} className="article-toc__list mt-5">
                {renderTocNodes(tocTree)}
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
