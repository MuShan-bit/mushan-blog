"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  defaultPalette,
  normalizePalette,
  paletteChangeEvent,
  paletteStorageKey,
} from "@/lib/color-themes";

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

export function applyPalette(paletteId: string) {
  const nextPalette = normalizePalette(paletteId);

  document.documentElement.dataset.palette = nextPalette;
  window.localStorage.setItem(paletteStorageKey, nextPalette);
  window.dispatchEvent(new Event(paletteChangeEvent));
}

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const palette = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.dataset.palette = palette;
  }, [palette]);

  return <>{children}</>;
}
