"use client";

import { Check, Palette } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { colorPalettes } from "@/lib/color-themes";
import { applyPalette } from "@/components/theme/color-theme-provider";
import { useColorPalette } from "@/components/theme/use-color-palette";

export function PaletteSwitcher() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const activePalette = useColorPalette();

  const current = useMemo(() => {
    return colorPalettes.find((palette) => palette.id === activePalette) ?? colorPalettes[0];
  }, [activePalette]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return;
      }

      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="切换配色方案"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "glass-panel soft-ring text-foreground/80 inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm sm:h-11 sm:gap-2 sm:px-4",
          "hover:text-foreground hover:-translate-y-0.5",
        )}
      >
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">{current.name}</span>
      </button>

      {open ? (
        <div className="border-border bg-surface-strong absolute top-[calc(100%+0.65rem)] right-0 z-50 w-[min(16.5rem,calc(100vw-1rem))] rounded-[1.2rem] border p-2.5 shadow-[0_24px_90px_rgba(16,34,28,0.16)] backdrop-blur-2xl sm:top-[calc(100%+0.75rem)] sm:w-[20rem] sm:rounded-[1.5rem] sm:p-3">
          <div className="mb-1.5 px-1.5 py-1 sm:mb-2 sm:px-2">
            <p className="text-foreground text-sm font-medium">配色主题</p>
            <p className="text-muted mt-1 hidden text-xs leading-6 sm:block">
              明暗模式之外，再给页面换一层气质。
            </p>
          </div>

          <div className="grid gap-1.5 sm:gap-2">
            {colorPalettes.map((palette) => {
              const isActive = palette.id === activePalette;

              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => {
                    applyPalette(palette.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex items-start gap-2.5 rounded-[0.95rem] border px-2.5 py-2.5 text-left sm:gap-3 sm:rounded-[1.1rem] sm:px-3 sm:py-3",
                    isActive
                      ? "border-accent/30 bg-accent-soft"
                      : "border-border hover:border-accent/20 bg-white/35 hover:bg-white/50 dark:bg-white/5 dark:hover:bg-white/8",
                  )}
                >
                  <div className="mt-0.5 flex items-center gap-1">
                    {palette.swatches.map((swatch) => (
                      <span
                        key={swatch}
                        className="h-3.5 w-3.5 rounded-full border border-white/50 shadow-sm sm:h-4 sm:w-4"
                        style={{ backgroundColor: swatch }}
                      />
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-foreground text-sm font-medium">{palette.name}</span>
                      {isActive ? <Check className="text-accent-strong h-4 w-4" /> : null}
                    </div>
                    <p className="text-muted mt-1 hidden text-xs leading-6 sm:block">
                      {palette.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
