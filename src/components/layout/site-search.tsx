"use client";

import { FileImage, FileText, FolderGit2, Layers3, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { siteSearchOpenEvent, type SiteSearchOpenDetail } from "@/lib/site-search";

type SearchKind = "post" | "portfolio" | "gallery" | "series";

type SearchOption = {
  id: string;
  kind: SearchKind;
  title: string;
  summary: string;
  href: string;
  meta: string;
};

type SearchApiResponse = {
  options: SearchOption[];
  total: number;
};

type SearchState = "idle" | "loading" | "done" | "error";

const kindLabelMap: Record<SearchKind, string> = {
  post: "文章",
  portfolio: "作品",
  gallery: "相册",
  series: "专题",
};

function getKindIcon(kind: SearchKind) {
  switch (kind) {
    case "post":
      return FileText;
    case "portfolio":
      return FolderGit2;
    case "gallery":
      return FileImage;
    case "series":
      return Layers3;
    default:
      return FileText;
  }
}

function useDebouncedValue(value: string, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebounced(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [value, delayMs]);

  return debounced;
}

export function SiteSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [state, setState] = useState<SearchState>("idle");
  const [options, setOptions] = useState<SearchOption[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const portalRoot = typeof document === "undefined" ? null : document.body;
  const debouncedQuery = useDebouncedValue(query, 160);
  const isLoading = state === "loading";
  const hasResults = options.length > 0;
  const safeActiveIndex = hasResults ? Math.min(activeIndex, options.length - 1) : -1;

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [open]);

  useEffect(() => {
    const openSearch = (nextQuery?: string) => {
      if (typeof nextQuery === "string") {
        setQuery(nextQuery);
      } else {
        setQuery("");
      }

      setOpen(true);
      setActiveIndex(0);
      setState("loading");
    };

    const onOpenRequest = (event: Event) => {
      const customEvent = event as CustomEvent<SiteSearchOpenDetail>;
      openSearch(customEvent.detail?.query);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "p") {
        event.preventDefault();
        openSearch();
        return;
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener(siteSearchOpenEvent, onOpenRequest as EventListener);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener(siteSearchOpenEvent, onOpenRequest as EventListener);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (panelRef.current?.contains(event.target as Node)) {
        return;
      }

      setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const controller = new AbortController();
    const currentRequestId = requestIdRef.current + 1;
    requestIdRef.current = currentRequestId;

    const params = new URLSearchParams();

    if (debouncedQuery.trim()) {
      params.set("q", debouncedQuery.trim());
    }

    void fetch(`/api/search/options?${params.toString()}`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Search request failed: ${response.status}`);
        }

        const data = (await response.json()) as SearchApiResponse;

        if (requestIdRef.current !== currentRequestId) {
          return;
        }

        setOptions(data.options ?? []);
        setActiveIndex(0);
        setState("done");
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }

        console.error(error);

        if (requestIdRef.current !== currentRequestId) {
          return;
        }

        setOptions([]);
        setState("error");
      });

    return () => {
      controller.abort();
    };
  }, [open, debouncedQuery]);

  const close = () => {
    setOpen(false);
  };

  const navigateToOption = (option: SearchOption | undefined) => {
    if (!option) {
      return;
    }

    close();
    router.push(option.href);
  };

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!options.length) {
        return;
      }

      setActiveIndex((current) => (current + 1) % options.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!options.length) {
        return;
      }

      setActiveIndex((current) => (current - 1 + options.length) % options.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      navigateToOption(options[safeActiveIndex]);
    }
  };

  if (!open || !portalRoot) {
    return null;
  }

  return createPortal(
    <div
      className="site-search-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="全站搜索"
    >
      <section ref={panelRef} className="site-search-panel">
        <header className="site-search-panel__header">
          <div className="site-search-input-wrap">
            <Search className="site-search-input-wrap__icon" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
                setState("loading");
              }}
              onKeyDown={onInputKeyDown}
              className="site-search-input"
              placeholder="搜索文章、作品、相册、专题..."
            />
          </div>
          <button type="button" className="site-search-close" onClick={close} aria-label="关闭搜索">
            Esc
          </button>
        </header>

        <div className="site-search-panel__meta">
          <p className="text-muted text-xs">⌘P / Ctrl+P 打开 · ↑↓ 选择 · Enter 跳转</p>
        </div>

        <div className="site-search-results" role="listbox" aria-label="搜索结果">
          {isLoading ? (
            <div className="site-search-empty">
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              <span>正在检索中...</span>
            </div>
          ) : null}

          {!isLoading && state === "error" ? (
            <div className="site-search-empty">
              <span>测试数据接口暂时不可用，请稍后重试。</span>
            </div>
          ) : null}

          {!isLoading && state !== "error" && !hasResults ? (
            <div className="site-search-empty">
              <span>没有找到匹配内容，试试其它关键词。</span>
            </div>
          ) : null}

          {!isLoading && hasResults
            ? options.map((option, index) => {
                const Icon = getKindIcon(option.kind);
                const active = index === safeActiveIndex;

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={cn("site-search-item", active && "site-search-item--active")}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => navigateToOption(option)}
                    role="option"
                    aria-selected={active}
                  >
                    <span className="site-search-item__icon">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="site-search-item__body">
                      <span className="site-search-item__title">{option.title}</span>
                      <span className="site-search-item__summary">{option.summary}</span>
                    </span>
                    <span className="site-search-item__meta">
                      <span className="site-search-item__kind">{kindLabelMap[option.kind]}</span>
                      <span className="site-search-item__tag">{option.meta}</span>
                    </span>
                  </button>
                );
              })
            : null}
        </div>
      </section>
    </div>,
    portalRoot,
  );
}
