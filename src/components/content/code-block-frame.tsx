"use client";

import { Expand, Minimize2 } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CopyCodeButton } from "@/components/content/copy-code-button";
import { cn } from "@/lib/cn";

type CodeBlockFrameProps = {
  code: string;
  label: string;
  highlighted: string;
  lineCount: number;
};

const maxPreviewLines = 10;
const openAnimationMs = 280;
const closeAnimationMs = 220;

export function CodeBlockFrame({ code, label, highlighted, lineCount }: CodeBlockFrameProps) {
  const timerRef = useRef<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [previewState, setPreviewState] = useState<"closed" | "entering" | "open" | "exiting">("closed");
  const previewVisible = previewState !== "closed";
  const portalRoot = typeof document === "undefined" ? null : document.body;

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

  return (
    <>
      <CodeBlockFigure
        code={code}
        label={label}
        highlighted={highlighted}
        lineCount={lineCount}
        expanded={false}
        onToggle={openPreview}
      />
      {portalRoot && previewVisible
        ? createPortal(
            <div
              className="code-block-preview"
              data-state={previewState}
              onClick={closePreview}
              role="dialog"
              aria-modal="true"
              aria-label={`${label} 代码放大预览`}
            >
              <div className="code-block-preview__panel" onClick={(event) => event.stopPropagation()}>
                <CodeBlockFigure
                  code={code}
                  label={label}
                  highlighted={highlighted}
                  lineCount={lineCount}
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

function CodeBlockFigure({
  code,
  label,
  highlighted,
  lineCount,
  expanded,
  onToggle,
}: {
  code: string;
  label: string;
  highlighted: string;
  lineCount: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isConstrained = !expanded && lineCount > maxPreviewLines;

  return (
    <figure className={cn("code-block not-prose", isConstrained && "code-block--constrained", expanded && "code-block--immersive")}>
      <CodeBlockHeader code={code} label={label} expanded={expanded} onToggle={onToggle} />
      <div className="code-block__body" dangerouslySetInnerHTML={{ __html: highlighted }} />
    </figure>
  );
}

function CodeBlockHeader({
  code,
  label,
  expanded,
  onToggle,
}: {
  code: string;
  label: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <figcaption className="code-block__header">
      <span className="code-block__language">{label}</span>
      <div className="flex items-center gap-2">
        <CopyCodeButton code={code} />
        <button
          type="button"
          onClick={onToggle}
          className="code-block__action"
          aria-label={expanded ? "关闭放大代码预览" : "放大预览代码"}
        >
          {expanded ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
          {expanded ? "收起" : "放大"}
        </button>
      </div>
    </figcaption>
  );
}
