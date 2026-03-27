import { cn } from "@/lib/cn";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("loading-skeleton", className)} aria-hidden="true" />;
}

function LoadingBadge({ label }: { label: string }) {
  return (
    <div className="loading-badge">
      <span className="loading-badge__dot" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function PageIntroSkeleton({
  badge,
  actions = false,
}: {
  badge: string;
  actions?: boolean;
}) {
  return (
    <section className="glass-panel rounded-[2rem] p-7 sm:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <LoadingBadge label={badge} />
          <SkeletonBlock className="h-11 w-full max-w-2xl rounded-[1.2rem] sm:h-14" />
          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-full max-w-3xl rounded-full" />
            <SkeletonBlock className="h-4 w-[82%] max-w-2xl rounded-full" />
          </div>
        </div>
        {actions ? (
          <div className="flex flex-wrap gap-3">
            <SkeletonBlock className="h-11 w-36 rounded-full" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function PostCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <article className="glass-panel overflow-hidden rounded-[1.75rem]">
      <SkeletonBlock className={cn("w-full", compact ? "aspect-[16/9]" : "aspect-[16/10]")} />
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <SkeletonBlock className="h-8 w-24 rounded-full" />
          <SkeletonBlock className="h-4 w-20 rounded-full" />
          <SkeletonBlock className="h-4 w-28 rounded-full" />
        </div>
        <div className="space-y-3">
          <SkeletonBlock className="h-9 w-full max-w-[18rem] rounded-[1rem]" />
          <SkeletonBlock className="h-4 w-full rounded-full" />
          <SkeletonBlock className="h-4 w-[86%] rounded-full" />
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <SkeletonBlock className="h-7 w-20 rounded-full" />
            <SkeletonBlock className="h-7 w-24 rounded-full" />
            <SkeletonBlock className="h-7 w-16 rounded-full" />
          </div>
          <SkeletonBlock className="h-4 w-16 rounded-full" />
        </div>
      </div>
    </article>
  );
}

export function PortfolioCardSkeleton() {
  return (
    <article className="glass-panel overflow-hidden rounded-[1.75rem]">
      <SkeletonBlock className="aspect-[16/10] w-full" />
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <SkeletonBlock className="h-8 w-28 rounded-full" />
          <SkeletonBlock className="h-4 w-24 rounded-full" />
          <SkeletonBlock className="h-8 w-20 rounded-full" />
        </div>
        <div className="space-y-3">
          <SkeletonBlock className="h-9 w-full max-w-[18rem] rounded-[1rem]" />
          <SkeletonBlock className="h-4 w-full rounded-full" />
          <SkeletonBlock className="h-4 w-[82%] rounded-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          <SkeletonBlock className="h-7 w-16 rounded-full" />
          <SkeletonBlock className="h-7 w-20 rounded-full" />
          <SkeletonBlock className="h-7 w-24 rounded-full" />
        </div>
      </div>
    </article>
  );
}

export function AlbumCardSkeleton() {
  return (
    <article className="glass-panel overflow-hidden rounded-[1.75rem]">
      <SkeletonBlock className="aspect-[4/3] w-full" />
      <div className="space-y-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <SkeletonBlock className="h-8 w-24 rounded-full" />
          <SkeletonBlock className="h-4 w-14 rounded-full" />
        </div>
        <SkeletonBlock className="h-9 w-full max-w-[16rem] rounded-[1rem]" />
        <SkeletonBlock className="h-4 w-full rounded-full" />
        <SkeletonBlock className="h-4 w-[78%] rounded-full" />
      </div>
    </article>
  );
}

export function FriendCardSkeleton() {
  return (
    <article className="glass-panel rounded-[1.8rem] p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <SkeletonBlock className="h-14 w-14 rounded-[1.3rem]" />
          <div className="min-w-0 flex-1 space-y-3">
            <SkeletonBlock className="h-6 w-36 rounded-full" />
            <SkeletonBlock className="h-4 w-full max-w-xl rounded-full" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <SkeletonBlock className="h-8 w-16 rounded-full" />
          <SkeletonBlock className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </article>
  );
}

export function HomePageSkeleton() {
  return (
    <>
      <section className="home-hero px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(19rem,0.82fr)] lg:gap-12">
          <div className="space-y-6">
            <LoadingBadge label="正在铺开首页内容" />
            <SkeletonBlock className="h-6 w-56 rounded-full" />
            <SkeletonBlock className="h-20 w-full max-w-4xl rounded-[2rem] sm:h-24" />
            <div className="space-y-3">
              <SkeletonBlock className="h-4 w-full max-w-2xl rounded-full" />
              <SkeletonBlock className="h-4 w-[88%] max-w-3xl rounded-full" />
              <SkeletonBlock className="h-4 w-[72%] max-w-2xl rounded-full" />
            </div>

            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 6 }).map((_, item) => (
                <SkeletonBlock key={item} className="h-9 w-20 rounded-full" />
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <SkeletonBlock className="h-12 w-32 rounded-full" />
              <SkeletonBlock className="h-12 w-32 rounded-full" />
            </div>
          </div>

          <div className="grid gap-4">
            {[0, 1].map((item) => (
              <div key={item} className="glass-panel rounded-[2rem] p-6">
                <SkeletonBlock className="h-5 w-40 rounded-full" />
                <div className="mt-4 space-y-3">
                  <SkeletonBlock className="h-4 w-full rounded-full" />
                  <SkeletonBlock className="h-4 w-[84%] rounded-full" />
                  <SkeletonBlock className="h-4 w-[70%] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="glass-panel rounded-[1.6rem] p-5">
              <SkeletonBlock className="h-4 w-20 rounded-full" />
              <SkeletonBlock className="mt-4 h-10 w-16 rounded-[1rem]" />
            </div>
          ))}
        </div>
      </section>

      <section className="site-grid">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-24 rounded-full" />
            <SkeletonBlock className="h-10 w-72 rounded-[1rem]" />
          </div>
          <SkeletonBlock className="h-4 w-24 rounded-full" />
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <PostCardSkeleton key={item} compact />
          ))}
        </div>
      </section>
    </>
  );
}

export function CollectionPageSkeleton({
  badge,
  cards = 4,
  cardType = "post",
  withSidebar = false,
}: {
  badge: string;
  cards?: number;
  cardType?: "post" | "portfolio" | "album" | "friend";
  withSidebar?: boolean;
}) {
  const renderCard = (index: number) => {
    if (cardType === "portfolio") {
      return <PortfolioCardSkeleton key={index} />;
    }

    if (cardType === "album") {
      return <AlbumCardSkeleton key={index} />;
    }

    if (cardType === "friend") {
      return <FriendCardSkeleton key={index} />;
    }

    return <PostCardSkeleton key={index} />;
  };

  return (
    <>
      <PageIntroSkeleton badge={badge} actions={cardType === "portfolio"} />

      <section
        className={cn(
          "grid gap-5",
          withSidebar ? "lg:grid-cols-[minmax(0,1fr)_22rem]" : "lg:grid-cols-2",
        )}
      >
        <div
          className={cn(
            "grid gap-5",
            withSidebar
              ? "lg:grid-cols-2"
              : cardType === "friend"
                ? "grid-cols-1 lg:col-span-2"
                : "lg:grid-cols-2",
          )}
        >
          {Array.from({ length: cards }, (_, index) => renderCard(index))}
        </div>

        {withSidebar ? (
          <aside className="space-y-5">
            {[0, 1].map((item) => (
              <div key={item} className="glass-panel rounded-[1.8rem] p-6">
                <SkeletonBlock className="h-5 w-24 rounded-full" />
                <div className="mt-5 flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4].map((token) => (
                    <SkeletonBlock key={token} className="h-9 w-20 rounded-full" />
                  ))}
                </div>
              </div>
            ))}
          </aside>
        ) : null}
      </section>
    </>
  );
}

export function ReaderPageSkeleton({
  badge,
  detailLabel,
  hasSidebar = true,
  hasRelated = true,
}: {
  badge: string;
  detailLabel: string;
  hasSidebar?: boolean;
  hasRelated?: boolean;
}) {
  return (
    <>
      <div className="relative">
        <article
          className={cn(
            "article-reader grid gap-6",
            hasSidebar ? "xl:grid-cols-[minmax(0,1fr)_20rem]" : "xl:grid-cols-1",
          )}
        >
          <div className="min-w-0 space-y-6">
            <section className="glass-panel overflow-hidden rounded-[2.2rem]">
              <SkeletonBlock className="aspect-[16/8] w-full" />
              <div className="space-y-6 p-7 sm:p-10">
                <LoadingBadge label={badge} />
                <div className="flex flex-wrap items-center gap-3">
                  <SkeletonBlock className="h-9 w-24 rounded-full" />
                  <SkeletonBlock className="h-4 w-24 rounded-full" />
                  <SkeletonBlock className="h-4 w-20 rounded-full" />
                  <SkeletonBlock className="h-4 w-14 rounded-full" />
                </div>
                <div className="space-y-4">
                  <SkeletonBlock className="h-14 w-full max-w-3xl rounded-[1.4rem]" />
                  <SkeletonBlock className="h-4 w-full max-w-3xl rounded-full" />
                  <SkeletonBlock className="h-4 w-[84%] max-w-2xl rounded-full" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <SkeletonBlock className="h-9 w-20 rounded-full" />
                  <SkeletonBlock className="h-9 w-24 rounded-full" />
                  <SkeletonBlock className="h-9 w-16 rounded-full" />
                </div>
              </div>
            </section>

            <section className="glass-panel rounded-[2.2rem] p-7 sm:p-10">
              <div className="space-y-5">
                <div className="space-y-3">
                  <SkeletonBlock className="h-8 w-48 rounded-[1rem]" />
                  <SkeletonBlock className="h-4 w-full rounded-full" />
                  <SkeletonBlock className="h-4 w-[88%] rounded-full" />
                  <SkeletonBlock className="h-4 w-[74%] rounded-full" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <SkeletonBlock className="h-44 rounded-[1.6rem]" />
                  <SkeletonBlock className="h-44 rounded-[1.6rem]" />
                </div>

                <div className="space-y-3">
                  <SkeletonBlock className="h-6 w-40 rounded-full" />
                  {Array.from({ length: 7 }, (_, index) => (
                    <SkeletonBlock
                      key={index}
                      className={cn("h-4 rounded-full", index === 6 ? "w-[62%]" : "w-full")}
                    />
                  ))}
                </div>

                <div className="glass-panel rounded-[1.8rem] p-5">
                  <SkeletonBlock className="h-4 w-24 rounded-full" />
                  <SkeletonBlock className="mt-4 h-52 rounded-[1.4rem]" />
                </div>
              </div>
            </section>
          </div>

          {hasSidebar ? (
            <aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
              {[0, 1].map((item) => (
                <div key={item} className="glass-panel rounded-[1.8rem] p-6">
                  <SkeletonBlock className="h-5 w-24 rounded-full" />
                  <div className="mt-5 space-y-4">
                    {[0, 1, 2].map((line) => (
                      <div key={line} className="space-y-2">
                        <SkeletonBlock className="h-4 w-16 rounded-full" />
                        <SkeletonBlock className="h-4 w-24 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </aside>
          ) : null}
        </article>
      </div>

      {hasRelated ? (
        <section className="site-grid">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-3">
              <SkeletonBlock className="h-4 w-28 rounded-full" />
              <SkeletonBlock className="h-10 w-56 rounded-[1rem]" />
            </div>
            <SkeletonBlock className="h-4 w-24 rounded-full" />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {[0, 1].map((item) => (
              <PostCardSkeleton key={`${detailLabel}-${item}`} compact />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

export function GalleryDetailSkeleton() {
  return (
    <>
      <section className="glass-panel rounded-[2.2rem] p-7 sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl space-y-4">
            <LoadingBadge label="正在展开相册主题" />
            <SkeletonBlock className="h-12 w-full max-w-xl rounded-[1.2rem]" />
            <div className="space-y-3">
              <SkeletonBlock className="h-4 w-full max-w-3xl rounded-full" />
              <SkeletonBlock className="h-4 w-[78%] max-w-2xl rounded-full" />
            </div>
          </div>
          <SkeletonBlock className="h-4 w-24 rounded-full" />
        </div>
      </section>

      <section className="columns-1 gap-5 md:columns-2 xl:columns-3">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className="masonry-card mb-5">
            <SkeletonBlock
              className={cn(
                "w-full rounded-[1.75rem]",
                index % 3 === 0 ? "h-[20rem]" : index % 2 === 0 ? "h-[16rem]" : "h-[24rem]",
              )}
            />
          </div>
        ))}
      </section>
    </>
  );
}

export function AboutPageSkeleton() {
  return (
    <>
      <PageIntroSkeleton badge="正在组织木杉的个人档案" />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="glass-panel relative overflow-hidden rounded-[2rem] p-4 sm:p-6">
          <LoadingBadge label="正在描绘 3D 文本形象" />
          <SkeletonBlock className="mt-5 h-[26rem] rounded-[1.8rem] sm:h-[32rem]" />
        </div>

        <div className="grid gap-6">
          {[0, 1].map((item) => (
            <div key={item} className="glass-panel rounded-[2rem] p-7">
              <SkeletonBlock className="h-10 w-48 rounded-[1rem]" />
              <div className="mt-4 space-y-3">
                <SkeletonBlock className="h-4 w-full rounded-full" />
                <SkeletonBlock className="h-4 w-[84%] rounded-full" />
                <SkeletonBlock className="h-4 w-[72%] rounded-full" />
              </div>
              {item === 1 ? (
                <div className="mt-5 grid gap-3">
                  {[0, 1, 2].map((row) => (
                    <SkeletonBlock key={row} className="h-12 rounded-[1.2rem]" />
                  ))}
                </div>
              ) : (
                <SkeletonBlock className="mt-5 h-12 w-40 rounded-[1.2rem]" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {[0, 1].map((item) => (
          <div key={item} className="glass-panel rounded-[2rem] p-7">
            <SkeletonBlock className="h-10 w-28 rounded-[1rem]" />
            <div className="mt-5 flex flex-wrap gap-3">
              {Array.from({ length: 6 }, (_, index) => (
                <SkeletonBlock key={index} className="h-10 w-20 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="glass-panel rounded-[2rem] p-7">
        <SkeletonBlock className="h-10 w-36 rounded-[1rem]" />
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="border-border rounded-[1.6rem] border bg-white/35 p-5 dark:bg-white/5"
            >
              <SkeletonBlock className="h-8 w-24 rounded-[1rem]" />
              <div className="mt-3 space-y-3">
                <SkeletonBlock className="h-4 w-full rounded-full" />
                <SkeletonBlock className="h-4 w-[78%] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
