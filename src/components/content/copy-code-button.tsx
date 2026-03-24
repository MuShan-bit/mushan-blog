"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type CopyCodeButtonProps = {
  code: string;
  idleLabel?: string;
  copiedLabel?: string;
  idleAriaLabel?: string;
  copiedAriaLabel?: string;
};

export function CopyCodeButton({
  code,
  idleLabel = "复制",
  copiedLabel = "已复制",
  idleAriaLabel = "复制代码",
  copiedAriaLabel = "代码已复制",
}: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCopied(false);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-white/50 px-3 py-1.5 text-xs font-medium text-muted",
        "hover:border-accent/20 hover:text-accent-strong dark:bg-white/5",
      )}
      aria-label={copied ? copiedAriaLabel : idleAriaLabel}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? copiedLabel : idleLabel}
    </button>
  );
}
