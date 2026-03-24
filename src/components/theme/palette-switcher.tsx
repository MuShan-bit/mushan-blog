"use client";

import { Check, Palette } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import {
  colorPalettes,
  defaultPalette,
  normalizePalette,
  paletteChangeEvent,
  paletteStorageKey,
} from "@/lib/color-themes";
import { applyPalette } from "@/components/theme/color-theme-provider";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === paletteStorageKey) {
      callback();
    }
  };

  const onPaletteChange = () => callback();

  window.addEventListener("storage", onStorage);
  window.addEventListener(paletteChangeEvent, onPaletteChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(paletteChangeEvent, onPaletteChange);
  };
}

function getClientSnapshot() {
  if (typeof window === "undefined") {
    return defaultPalette;
  }

  return normalizePalette(window.localStorage.getItem(paletteStorageKey));
}

function getServerSnapshot() {
  return defaultPalette;
}

export function PaletteSwitcher() {
  const [open, setOpen] = useState(false);
  const activePalette = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const current = useMemo(() => {
    return colorPalettes.find((palette) => palette.id === activePalette) ?? colorPalettes[0];
  }, [activePalette]);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="切换配色方案"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "glass-panel soft-ring inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm text-foreground/80",
          "hover:-translate-y-0.5 hover:text-foreground",
        )}
      >
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">{current.name}</span>
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[20rem] rounded-[1.5rem] border border-border bg-surface-strong p-3 shadow-[0_24px_90px_rgba(16,34,28,0.16)] backdrop-blur-2xl">
          <div className="mb-2 px-2 py-1">
            <p className="text-sm font-medium text-foreground">配色主题</p>
            <p className="mt-1 text-xs leading-6 text-muted">明暗模式之外，再给页面换一层气质。</p>
          </div>

          <div className="grid gap-2">
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
                    "flex items-start gap-3 rounded-[1.1rem] border px-3 py-3 text-left",
                    isActive
                      ? "border-accent/30 bg-accent-soft"
                      : "border-border bg-white/35 hover:border-accent/20 hover:bg-white/50 dark:bg-white/5 dark:hover:bg-white/8",
                  )}
                >
                  <div className="mt-0.5 flex items-center gap-1">
                    {palette.swatches.map((swatch) => (
                      <span
                        key={swatch}
                        className="h-4 w-4 rounded-full border border-white/50 shadow-sm"
                        style={{ backgroundColor: swatch }}
                      />
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-foreground">{palette.name}</span>
                      {isActive ? <Check className="h-4 w-4 text-accent-strong" /> : null}
                    </div>
                    <p className="mt-1 text-xs leading-6 text-muted">{palette.description}</p>
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
