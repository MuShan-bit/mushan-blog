import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, Layers3 } from "lucide-react";
import { ViewCount } from "@/components/analytics/view-count";
import { InteractiveCard } from "@/components/content/interactive-card";
import { cn } from "@/lib/cn";
import type { Post } from "@/lib/types";
import { formatDate, slugify } from "@/lib/utils";

type PostCardProps = {
  post: Post;
  className?: string;
};

export function PostCard({ post, className }: PostCardProps) {
  const postPath = `/blog/${post.slug}`;

  return (
    <InteractiveCard
      className={cn(
        "glass-panel soft-ring group flex h-full flex-col overflow-hidden rounded-[1.75rem]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.cover}
          alt={post.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 40vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10" />
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link
            href={`/categories/${slugify(post.category)}`}
            className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-accent-strong hover:bg-accent-soft/80"
          >
            {post.category}
          </Link>
          <span>{formatDate(post.publishedAt)}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" />
            {post.readingTime.text}
          </span>
        </div>

        <div className="space-y-3">
          <Link href={postPath} className="group/title inline-flex items-center gap-2">
            <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
              {post.title}
            </h2>
            <ArrowUpRight className="h-4 w-4 text-muted transition group-hover/title:-translate-y-0.5 group-hover/title:translate-x-0.5 group-hover/title:text-accent-strong" />
          </Link>
          <p className="text-sm leading-7 text-muted">{post.summary}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/tags/${slugify(tag)}`}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white/35 px-3 py-1 text-xs text-muted hover:border-accent/20 hover:text-accent-strong dark:bg-white/5"
              >
                <Layers3 className="h-3.5 w-3.5" />
                {tag}
              </Link>
            ))}
          </div>
          <ViewCount path={postPath} />
        </div>
      </div>
    </InteractiveCard>
  );
}
