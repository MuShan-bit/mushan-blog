"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatViewCount } from "@/lib/utils";

type ViewCountProps = {
  path: string;
  className?: string;
};

export function ViewCount({ path, className }: ViewCountProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let isActive = true;

    void fetch(`/api/view?path=${encodeURIComponent(path)}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch view count");
        }

        const payload = (await response.json()) as { count?: number };

        if (isActive) {
          setCount(payload.count ?? 0);
        }
      })
      .catch(() => {
        if (isActive) {
          setCount(0);
        }
      });

    return () => {
      isActive = false;
    };
  }, [path]);

  return (
    <span className={cn("text-muted inline-flex items-center gap-1.5 text-sm", className)}>
      <Eye className="h-4 w-4" />
      {count === null ? "读取中" : `${formatViewCount(count)} 次阅读`}
    </span>
  );
}
