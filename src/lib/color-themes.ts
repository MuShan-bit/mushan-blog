export type ColorPalette = {
  id: string;
  name: string;
  description: string;
  swatches: [string, string, string];
};

export const defaultPalette = "verdant";
export const paletteStorageKey = "mushan-color-palette";
export const paletteChangeEvent = "mushan-color-palette-change";

export const colorPalettes: ColorPalette[] = [
  {
    id: "verdant",
    name: "森雾绿",
    description: "清新、柔和，适合长时间阅读，也是当前这套站点的主气质。",
    swatches: ["#2b8c6b", "#7bdfb2", "#74c6ff"],
  },
  {
    id: "ocean",
    name: "海雾蓝",
    description: "更冷静一点，适合技术内容和夜间浏览，不会太沉。",
    swatches: ["#2978c8", "#79b8ff", "#7fe8d5"],
  },
  {
    id: "sunrise",
    name: "曙光橙",
    description: "暖一点、更有生活感，适合摄影和随笔内容。",
    swatches: ["#d97732", "#ffc47d", "#ff9b8a"],
  },
  {
    id: "graphite",
    name: "雾石灰",
    description: "更克制的中性色，适合想把注意力更多留给正文的时候。",
    swatches: ["#546273", "#9eb0c1", "#cdd7e3"],
  },
];

export function isPaletteId(value: string | null | undefined): value is string {
  return colorPalettes.some((palette) => palette.id === value);
}

export function normalizePalette(value: string | null | undefined) {
  return isPaletteId(value) ? value : defaultPalette;
}

export function subscribePalette(callback: () => void) {
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

export function getPaletteClientSnapshot() {
  if (typeof window === "undefined") {
    return defaultPalette;
  }

  try {
    const storedPalette = window.localStorage.getItem(paletteStorageKey);

    if (isPaletteId(storedPalette)) {
      return storedPalette;
    }
  } catch {
    return normalizePalette(document.documentElement.dataset.palette);
  }

  return normalizePalette(document.documentElement.dataset.palette);
}

export function getPaletteServerSnapshot() {
  return defaultPalette;
}
