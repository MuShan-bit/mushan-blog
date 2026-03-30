import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Layers3 } from "lucide-react";
import { InteractiveCard } from "@/components/content/interactive-card";
import type { SeriesEntry } from "@/lib/types";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/utils";

type SeriesCardProps = {
  series: SeriesEntry;
  className?: string;
};

export function SeriesCard({ series, className }: SeriesCardProps) {
  const seriesPath = `/series/${series.slug}`;

  return (
    <InteractiveCard
      className={cn(
        "glass-panel soft-ring group flex h-full flex-col overflow-hidden rounded-[1.75rem]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={series.cover}
          alt={series.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 40vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="text-muted flex flex-wrap items-center gap-2 text-sm">
          <span className="bg-accent-soft text-accent-strong inline-flex items-center rounded-full px-3 py-1">
            专题阅读
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Layers3 className="h-4 w-4" />
            {series.totalPosts} 篇
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" />约 {series.totalReadingMinutes} 分钟
          </span>
        </div>

        <div className="space-y-3">
          <Link href={seriesPath} className="group/title inline-flex items-center gap-2">
            <h2 className="font-display text-foreground text-2xl font-semibold tracking-[-0.04em]">
              {series.title}
            </h2>
            <ArrowRight className="text-muted group-hover/title:text-accent-strong h-4 w-4 transition group-hover/title:translate-x-0.5" />
          </Link>
          <p className="text-muted text-sm leading-7">{series.summary}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <p className="text-muted text-xs">最近更新于 {formatDate(series.updatedAt)}</p>
          <Link
            href={seriesPath}
            className="text-accent-strong hover:text-accent inline-flex items-center gap-1.5 text-sm"
          >
            开始专题阅读
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </InteractiveCard>
  );
}
