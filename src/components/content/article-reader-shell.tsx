"use client";

import type { ReactNode } from "react";
import { ArrowUp, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

type ArticleReaderShellProps = {
  children: ReactNode;
  sidebar: ReactNode;
};

export function ArticleReaderShell({ children, sidebar }: ArticleReaderShellProps) {
  const [wideReading, setWideReading] = useState(false);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <div className="relative">
      <article className={cn("article-reader grid gap-6", wideReading ? "xl:grid-cols-1" : "xl:grid-cols-[minmax(0,1fr)_20rem]")}>
        <div className={cn("min-w-0 space-y-6", wideReading && "xl:mx-auto xl:w-full xl:max-w-[78rem]")}>{children}</div>
        <aside className={cn("space-y-5", !wideReading && "xl:sticky xl:top-28 xl:self-start", wideReading && "hidden")}>
          {sidebar}
        </aside>
      </article>

      <div className="reader-fab-stack">
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
          onClick={() => setWideReading((current) => !current)}
          className={cn("reader-fab", wideReading && "reader-fab--active")}
          aria-label={wideReading ? "退出宽屏阅读" : "开启宽屏阅读"}
          aria-pressed={wideReading}
          title={wideReading ? "退出宽屏阅读" : "开启宽屏阅读"}
        >
          {wideReading ? <PanelRightOpen className="h-5 w-5" /> : <PanelRightClose className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
