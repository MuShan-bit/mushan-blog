"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="切换主题"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "glass-panel soft-ring text-foreground/80 inline-flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11",
        "hover:text-foreground hover:-translate-y-0.5",
      )}
    >
      {isDark ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
    </button>
  );
}
