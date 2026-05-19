import type { CSSProperties } from "react";
import Link from "next/link";
import { Clock3, FileText, FolderKanban } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllPortfolioEntries, getPublishedPosts } from "@/lib/content";
import { cn } from "@/lib/cn";
import { createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata = createPageMetadata({
  title: "时间轴",
  description: "沿着时间轴查看文章与项目的创建、更新轨迹，从当下一路回看过去。",
  path: "/timeline",
  keywords: ["时间轴", "文章更新", "项目更新", "创作轨迹"],
});

type TimelineEventKind = "post" | "project";
type TimelineEventAction = "created" | "updated";
type TimelineSide = "left" | "right";

type TimelineEvent = {
  id: string;
  kind: TimelineEventKind;
  action: TimelineEventAction;
  title: string;
  summary: string;
  href: string;
  date: string;
  timestamp: number;
  meta: string;
  side: TimelineSide;
};

type TimelineItem =
  | {
      type: "year";
      year: number;
      id: string;
    }
  | {
      type: "event";
      event: TimelineEvent;
      id: string;
    };

const toneByEvent = {
  post: {
    created: {
      color: "#2b8c6b",
      label: "文章创建",
    },
    updated: {
      color: "#2978c8",
      label: "文章更新",
    },
  },
  project: {
    created: {
      color: "#d97732",
      label: "项目创建",
    },
    updated: {
      color: "#7a6cf0",
      label: "项目更新",
    },
  },
} as const;

function extractPeriodYears(period: string) {
  const years = Array.from(period.matchAll(/\b(19|20)\d{2}\b/g)).map((item) => Number(item[0]));

  if (!years.length) {
    return null;
  }

  return {
    startYear: Math.min(...years),
    endYear: Math.max(...years),
  };
}

function toTimestamp(dateText: string) {
  const timestamp = new Date(dateText).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

function buildTimelineItems(events: TimelineEvent[]): TimelineItem[] {
  const items: TimelineItem[] = [];
  let previousYear: number | null = null;

  events.forEach((event) => {
    const year = new Date(event.date).getFullYear();

    if (year !== previousYear) {
      items.push({
        type: "year",
        year,
        id: `timeline-year-${year}`,
      });
      previousYear = year;
    }

    items.push({
      type: "event",
      event,
      id: event.id,
    });
  });

  return items;
}

export default async function TimelinePage() {
  const [posts, portfolioEntries] = await Promise.all([getPublishedPosts(), getAllPortfolioEntries()]);

  const rawEvents: Omit<TimelineEvent, "side">[] = [];

  posts.forEach((post) => {
    const publishedTimestamp = toTimestamp(post.publishedAt);

    if (publishedTimestamp !== null) {
      rawEvents.push({
        id: `post-created-${post.slug}`,
        kind: "post",
        action: "created",
        title: post.title,
        summary: post.summary,
        href: `/blog/${post.slug}`,
        date: post.publishedAt,
        timestamp: publishedTimestamp,
        meta: post.category,
      });
    }

    if (post.updatedAt && post.updatedAt !== post.publishedAt) {
      const updatedTimestamp = toTimestamp(post.updatedAt);

      if (updatedTimestamp !== null) {
        rawEvents.push({
          id: `post-updated-${post.slug}`,
          kind: "post",
          action: "updated",
          title: post.title,
          summary: post.summary,
          href: `/blog/${post.slug}`,
          date: post.updatedAt,
          timestamp: updatedTimestamp,
          meta: post.category,
        });
      }
    }
  });

  portfolioEntries.forEach((entry) => {
    const years = extractPeriodYears(entry.period);

    if (!years) {
      return;
    }

    const createdDate = `${years.startYear}-01-01`;
    const createdTimestamp = toTimestamp(createdDate);

    if (createdTimestamp !== null) {
      rawEvents.push({
        id: `project-created-${entry.slug}`,
        kind: "project",
        action: "created",
        title: entry.title,
        summary: entry.summary,
        href: `/portfolio/${entry.slug}`,
        date: createdDate,
        timestamp: createdTimestamp,
        meta: entry.role,
      });
    }

    if (years.endYear > years.startYear) {
      const updatedDate = `${years.endYear}-12-31`;
      const updatedTimestamp = toTimestamp(updatedDate);

      if (updatedTimestamp !== null) {
        rawEvents.push({
          id: `project-updated-${entry.slug}`,
          kind: "project",
          action: "updated",
          title: entry.title,
          summary: entry.summary,
          href: `/portfolio/${entry.slug}`,
          date: updatedDate,
          timestamp: updatedTimestamp,
          meta: entry.role,
        });
      }
    }
  });

  const sortedEvents: TimelineEvent[] = rawEvents
    .sort((a, b) => b.timestamp - a.timestamp || a.title.localeCompare(b.title, "zh-CN"))
    .map((event, index) => ({
      ...event,
      side: (index % 2 === 0 ? "left" : "right") as TimelineSide,
    }));

  const timelineItems = buildTimelineItems(sortedEvents);

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "时间轴", path: "/timeline" },
        ])}
      />

      <section className="timeline-shell relative overflow-hidden rounded-[2rem] px-5 py-8 sm:px-7 sm:py-10">
        <div className="timeline-axis-line hidden md:block" aria-hidden />
        <div className="timeline-axis-line timeline-axis-line--mobile md:hidden" aria-hidden />

        <div className="relative z-10 space-y-0 pt-12">
          {timelineItems.map((item) => {
            if (item.type === "year") {
              return (
                <div key={item.id} className="py-2">
                  <div className="hidden items-center md:grid md:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)]">
                    <div />
                    <div className="flex justify-center">
                      <span className="timeline-year-chip">{item.year}</span>
                    </div>
                    <div />
                  </div>
                  <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center md:hidden">
                    <div className="flex justify-center">
                      <span className="timeline-year-chip">{item.year}</span>
                    </div>
                    <div />
                  </div>
                </div>
              );
            }

            const event = item.event;
            const tone = toneByEvent[event.kind][event.action];
            const Icon = event.kind === "post" ? FileText : FolderKanban;
            const eventBubble = (
              <Link
                href={event.href}
                className="timeline-bubble block"
                style={{ "--timeline-color": tone.color } as CSSProperties}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="timeline-event-badge">{tone.label}</span>
                  <span className="text-muted inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatDate(event.date)}
                  </span>
                </div>
                <h2 className="font-display text-foreground mt-3 text-xl font-semibold tracking-[-0.04em]">
                  {event.title}
                </h2>
                <p className="text-muted mt-2 text-sm leading-7">{event.summary}</p>
                <p className="text-muted mt-3 inline-flex items-center gap-2 text-xs">
                  <Icon className="h-3.5 w-3.5" />
                  {event.meta}
                </p>
              </Link>
            );

            return (
              <div key={item.id}>
                <div className="hidden items-center gap-4 py-4 md:grid md:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)]">
                  <div className={cn(event.side === "left" ? "block" : "invisible")}>
                    {event.side === "left" ? eventBubble : null}
                  </div>
                  <div className="flex justify-center">
                    <span
                      className="timeline-event-dot"
                      style={{ "--timeline-color": tone.color } as CSSProperties}
                    />
                  </div>
                  <div className={cn(event.side === "right" ? "block" : "invisible")}>
                    {event.side === "right" ? eventBubble : null}
                  </div>
                </div>

                <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-3 py-4 md:hidden">
                  <div className="flex justify-center">
                    <span
                      className="timeline-event-dot"
                      style={{ "--timeline-color": tone.color } as CSSProperties}
                    />
                  </div>
                  {eventBubble}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
