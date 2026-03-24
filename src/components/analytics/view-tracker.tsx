"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "mushan-viewed-paths";

export function ViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
    const stored = typeof window === "undefined" ? null : sessionStorage.getItem(STORAGE_KEY);
    const viewedPaths = new Set<string>(stored ? JSON.parse(stored) : []);

    if (viewedPaths.has(normalizedPath)) {
      return;
    }

    viewedPaths.add(normalizedPath);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...viewedPaths]));

    void fetch("/api/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: normalizedPath }),
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
