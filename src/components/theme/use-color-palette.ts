"use client";

import { useSyncExternalStore } from "react";
import {
  getPaletteClientSnapshot,
  getPaletteServerSnapshot,
  subscribePalette,
} from "@/lib/color-themes";

export function useColorPalette() {
  return useSyncExternalStore(subscribePalette, getPaletteClientSnapshot, getPaletteServerSnapshot);
}
