import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { InteractiveCard } from "@/components/content/interactive-card";
import { cn } from "@/lib/cn";
import type { PortfolioEntry } from "@/lib/types";

type PortfolioCardProps = {
  entry: PortfolioEntry;
  className?: string;
};

const statusMap: Record<PortfolioEntry["status"], string> = {
  active: "进行中",
  archived: "已归档",
  planned: "筹备中",
};

export function PortfolioCard({ entry, className }: PortfolioCardProps) {
  return (
    <InteractiveCard
      className={cn("glass-panel group overflow-hidden rounded-[1.75rem]", className)}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={entry.cover}
          alt={entry.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 40vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
      </div>
      <div className="space-y-4 p-6">
        <div className="text-muted flex flex-wrap items-center gap-2 text-sm">
          <span className="bg-accent-soft text-accent-strong rounded-full px-3 py-1">
            {entry.role}
          </span>
          <span>{entry.period}</span>
          <span className="border-border inline-flex items-center gap-1 rounded-full border px-3 py-1">
            <Sparkles className="h-3.5 w-3.5" />
            {statusMap[entry.status]}
          </span>
        </div>
        <div className="space-y-3">
          <Link
            href={`/portfolio/${entry.slug}`}
            className="group/title inline-flex items-center gap-2"
          >
            <h2 className="font-display text-foreground text-2xl font-semibold tracking-[-0.04em]">
              {entry.title}
            </h2>
            <ArrowUpRight className="text-muted group-hover/title:text-accent-strong h-4 w-4 transition group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5" />
          </Link>
          <p className="text-muted text-sm leading-7">{entry.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {entry.stack.map((item) => (
            <span
              key={item}
              className="border-border text-muted rounded-full border bg-white/35 px-3 py-1 text-xs dark:bg-white/5"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </InteractiveCard>
  );
}
