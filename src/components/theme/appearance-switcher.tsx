"use client";

import { PaletteSwitcher } from "@/components/theme/palette-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function AppearanceSwitcher() {
  return (
    <div className="flex items-center gap-2">
      <PaletteSwitcher />
      <ThemeToggle />
    </div>
  );
}
