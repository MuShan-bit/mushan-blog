import Link from "next/link";
import { ExternalLink, Rss } from "lucide-react";
import { InteractiveCard } from "@/components/content/interactive-card";
import type { FriendLink } from "@/lib/types";

export function FriendCard({ friend }: { friend: FriendLink }) {
  return (
    <InteractiveCard className="glass-panel group rounded-[1.6rem] p-5">
      <div className="flex items-start gap-4">
        <div className="border-border relative h-16 w-16 overflow-hidden rounded-2xl border bg-white/45 dark:bg-white/5">
          {/* `img` keeps remote/local SVG avatars working without extra domain allowlists. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={friend.avatar}
            alt={friend.name}
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-foreground text-xl font-semibold tracking-[-0.04em]">
                {friend.name}
              </h2>
              <p className="text-muted mt-1 text-sm leading-7">{friend.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {friend.rss ? (
                <Link
                  href={friend.rss}
                  target="_blank"
                  rel="noreferrer"
                  className="border-border text-muted hover:border-accent/20 hover:text-accent-strong rounded-full border p-2"
                >
                  <Rss className="h-4 w-4" />
                </Link>
              ) : null}
              <Link
                href={friend.url}
                target="_blank"
                rel="noreferrer"
                className="border-border text-muted hover:border-accent/20 hover:text-accent-strong rounded-full border p-2"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {friend.tags.map((tag) => (
              <span
                key={tag}
                className="border-border text-muted rounded-full border bg-white/35 px-3 py-1 text-xs dark:bg-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </InteractiveCard>
  );
}
