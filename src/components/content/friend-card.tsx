import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Rss } from "lucide-react";
import type { FriendLink } from "@/lib/types";

export function FriendCard({ friend }: { friend: FriendLink }) {
  return (
    <article className="glass-panel rounded-[1.6rem] p-5">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-border bg-white/45 dark:bg-white/5">
          <Image src={friend.avatar} alt={friend.name} fill className="object-cover" sizes="64px" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
                {friend.name}
              </h2>
              <p className="mt-1 text-sm leading-7 text-muted">{friend.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {friend.rss ? (
                <Link
                  href={friend.rss}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border p-2 text-muted hover:border-accent/20 hover:text-accent-strong"
                >
                  <Rss className="h-4 w-4" />
                </Link>
              ) : null}
              <Link
                href={friend.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border p-2 text-muted hover:border-accent/20 hover:text-accent-strong"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {friend.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-white/35 px-3 py-1 text-xs text-muted dark:bg-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
