"use client";

import { AlertTriangle, Expand, Minimize2, Workflow } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useEffectEvent, useId, useRef, useState, useTransition } from "react";
import { CopyCodeButton } from "@/components/content/copy-code-button";
import { cn } from "@/lib/cn";

type MermaidBlockProps = {
  chart: string;
};

const openAnimationMs = 280;
const closeAnimationMs = 220;

function readCssVariable(name: string, fallback: string) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function sanitizeSvg(svg: string) {
  return svg.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

export function MermaidBlock({ chart }: MermaidBlockProps) {
  const diagramId = useId().replace(/:/g, "");
  const timerRef = useRef<number | null>(null);
  const portalRoot = typeof document === "undefined" ? null : document.body;
  const [, startTransition] = useTransition();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [paletteRevision, setPaletteRevision] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const [previewState, setPreviewState] = useState<"closed" | "entering" | "open" | "exiting">("closed");
  const previewVisible = previewState !== "closed";

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      if (
        mutations.some(
          (mutation) => mutation.attributeName === "class" || mutation.attributeName === "data-palette",
        )
      ) {
        setPaletteRevision((current) => current + 1);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-palette"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = (event?: MediaQueryListEvent) => {
      setReduceMotion(event?.matches ?? mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  function clearTimer() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function openPreview() {
    clearTimer();

    if (reduceMotion) {
      setPreviewState("open");
      return;
    }

    setPreviewState("entering");
    timerRef.current = window.setTimeout(() => {
      setPreviewState("open");
      timerRef.current = null;
    }, openAnimationMs);
  }

  function closePreview() {
    if (previewState === "closed" || previewState === "exiting") {
      return;
    }

    clearTimer();

    if (reduceMotion) {
      setPreviewState("closed");
      return;
    }

    setPreviewState("exiting");
    timerRef.current = window.setTimeout(() => {
      setPreviewState("closed");
      timerRef.current = null;
    }, closeAnimationMs);
  }

  const handleEscape = useEffectEvent(() => {
    closePreview();
  });

  useEffect(() => {
    if (!previewVisible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      handleEscape();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [previewVisible]);

  const renderDiagram = useEffectEvent(async () => {
    startTransition(() => {
      setStatus("loading");
      setError("");
      setSvg("");
    });

    try {
      const mermaidModule = await import("mermaid");
      const mermaid = mermaidModule.default;

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        fontFamily: 'var(--font-manrope), "PingFang SC", "Noto Sans CJK SC", sans-serif',
        themeVariables: {
          background: "transparent",
          primaryColor: readCssVariable("--surface-strong", "#ffffff"),
          primaryTextColor: readCssVariable("--foreground", "#193127"),
          primaryBorderColor: readCssVariable("--border", "#d8e6dd"),
          lineColor: readCssVariable("--accent", "#2b8c6b"),
          secondaryColor: readCssVariable("--background-muted", "#edf7ef"),
          tertiaryColor: readCssVariable("--surface-soft", "#f6fbf7"),
          mainBkg: readCssVariable("--surface-strong", "#ffffff"),
          nodeBorder: readCssVariable("--border", "#d8e6dd"),
          nodeTextColor: readCssVariable("--foreground", "#193127"),
          clusterBkg: readCssVariable("--surface-soft", "#f5faf6"),
          clusterBorder: readCssVariable("--border", "#d8e6dd"),
          edgeLabelBackground: readCssVariable("--surface-strong", "#ffffff"),
          titleColor: readCssVariable("--foreground", "#193127"),
          noteBkgColor: readCssVariable("--accent-soft", "#e6f5ee"),
          noteTextColor: readCssVariable("--foreground", "#193127"),
          noteBorderColor: readCssVariable("--accent", "#2b8c6b"),
          activationBorderColor: readCssVariable("--accent", "#2b8c6b"),
          sequenceNumberColor: readCssVariable("--accent-strong", "#1f6a52"),
        },
      });

      const { svg: nextSvg } = await mermaid.render(`mermaid-${diagramId}-${paletteRevision}`, chart);

      startTransition(() => {
        setSvg(sanitizeSvg(nextSvg));
        setStatus("ready");
      });
    } catch (renderError) {
      const message = renderError instanceof Error ? renderError.message : "Mermaid 图渲染失败。";

      startTransition(() => {
        setError(message);
        setStatus("error");
      });
    }
  });

  useEffect(() => {
    void renderDiagram();
  }, [chart, paletteRevision]);

  return (
    <>
      <MermaidFigure chart={chart} svg={svg} status={status} error={error} expanded={false} onToggle={openPreview} />
      {portalRoot && previewVisible
        ? createPortal(
            <div
              className="mermaid-preview"
              data-state={previewState}
              onClick={closePreview}
              role="dialog"
              aria-modal="true"
              aria-label="Mermaid 图表放大预览"
            >
              <div className="mermaid-preview__panel" onClick={(event) => event.stopPropagation()}>
                <MermaidFigure
                  chart={chart}
                  svg={svg}
                  status={status}
                  error={error}
                  expanded
                  onToggle={closePreview}
                />
              </div>
            </div>,
            portalRoot,
          )
        : null}
    </>
  );
}

function MermaidFigure({
  chart,
  svg,
  status,
  error,
  expanded,
  onToggle,
}: {
  chart: string;
  svg: string;
  status: "loading" | "ready" | "error";
  error: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <figure className={cn("mermaid-block not-prose", expanded && "mermaid-block--immersive")}>
      <figcaption className="mermaid-block__header">
        <span className="mermaid-block__label">
          <Workflow className="h-4 w-4" />
          Mermaid
        </span>
        <div className="flex items-center gap-2">
          <CopyCodeButton
            code={chart}
            idleLabel="复制源码"
            copiedLabel="源码已复制"
            idleAriaLabel="复制 Mermaid 源码"
            copiedAriaLabel="Mermaid 源码已复制"
          />
          <button
            type="button"
            onClick={onToggle}
            className="code-block__action"
            aria-label={expanded ? "关闭 Mermaid 放大预览" : "放大预览 Mermaid 图表"}
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
            {expanded ? "收起" : "放大"}
          </button>
        </div>
      </figcaption>

      {status === "error" ? (
        <div className="mermaid-block__error" role="alert">
          <div className="mermaid-block__error-title">
            <AlertTriangle className="h-4 w-4" />
            Mermaid 图暂时没有渲染成功
          </div>
          <p className="mermaid-block__error-message">{error}</p>
          <pre className="mermaid-block__fallback">
            <code>{chart}</code>
          </pre>
        </div>
      ) : (
        <div className="mermaid-block__canvas" data-status={status}>
          {status === "loading" ? <p className="mermaid-block__loading">Mermaid 图正在生成中...</p> : null}
          {svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : null}
        </div>
      )}
    </figure>
  );
}
