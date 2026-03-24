"use client";

import { useEffect, useRef } from "react";
import {
  getPaletteClientSnapshot,
  normalizePalette,
  paletteStorageKey,
  paletteChangeEvent,
} from "@/lib/color-themes";
import { useColorPalette } from "@/components/theme/use-color-palette";

export function applyPalette(paletteId: string) {
  const nextPalette = normalizePalette(paletteId);

  document.documentElement.dataset.palette = nextPalette;
  try {
    window.localStorage.setItem(paletteStorageKey, nextPalette);
  } catch {}
  window.dispatchEvent(new Event(paletteChangeEvent));
}

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const palette = useColorPalette();
  const isFirstSyncRef = useRef(true);

  useEffect(() => {
    const nextPalette = isFirstSyncRef.current ? getPaletteClientSnapshot() : palette;
    isFirstSyncRef.current = false;

    document.documentElement.dataset.palette = nextPalette;
    document.documentElement.dataset.paletteReady = "true";
  }, [palette]);

  return <>{children}</>;
}
