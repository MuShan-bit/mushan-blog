"use client";

import type { CSSProperties } from "react";
import { useSyncExternalStore } from "react";
import { Music4 } from "lucide-react";
import { useTheme } from "next-themes";
import { useFocusMode } from "@/components/providers/focus-mode-provider";
import { applyPalette } from "@/components/theme/color-theme-provider";
import { useColorPalette } from "@/components/theme/use-color-palette";
import { cn } from "@/lib/cn";
import { colorPalettes } from "@/lib/color-themes";

export function HomeThemeDots() {
  const activePalette = useColorPalette();
  const { resolvedTheme, setTheme } = useTheme();
  const { active: focusActive, busy: focusBusy, soundscapeLabel, toggle } = useFocusMode();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="home-theme-dots" aria-label="首页主题快捷切换">
      {colorPalettes.map((palette) => {
        const isActive = palette.id === activePalette;

        return (
          <button
            key={palette.id}
            type="button"
            onClick={() => applyPalette(palette.id)}
            className={cn("home-theme-dot", isActive && "home-theme-dot--active")}
            aria-label={`切换到${palette.name}`}
            aria-pressed={isActive}
            title={palette.name}
          >
            <span
              className="home-theme-dot__swatch"
              style={
                {
                  "--theme-dot-start": palette.swatches[0],
                  "--theme-dot-end": palette.swatches[1],
                  "--theme-dot-glow": palette.swatches[2] ?? palette.swatches[1],
                } as CSSProperties
              }
            />
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn("home-theme-dot home-theme-dot--mode", isDark && "home-theme-dot--active")}
        aria-label={isDark ? "切换到亮色模式" : "切换到暗色模式"}
        aria-pressed={isDark}
        title={isDark ? "切换到亮色模式" : "切换到暗色模式"}
      >
        <span className="home-theme-dot__mode">
          <span className="home-theme-dot__mode-core" />
        </span>
      </button>

      <button
        type="button"
        onClick={toggle}
        disabled={focusBusy}
        className={cn(
          "home-theme-dot home-theme-dot--note",
          focusActive && "home-theme-dot--active home-theme-dot--focus-active",
          focusBusy && "home-theme-dot--busy",
        )}
        aria-label={focusActive ? `关闭专注模式，当前为${soundscapeLabel}` : `开启专注模式，当前为${soundscapeLabel}`}
        aria-pressed={focusActive}
        title={focusActive ? `关闭专注模式 · ${soundscapeLabel}` : `开启专注模式 · ${soundscapeLabel}`}
      >
        <span className="home-theme-dot__note">
          <Music4 className="h-[0.62rem] w-[0.62rem]" />
        </span>
      </button>
    </div>
  );
}
