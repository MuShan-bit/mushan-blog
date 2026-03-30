import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Layers3 } from "lucide-react";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { getSeriesBySlug, getAllSeries } from "@/lib/content";
import { absoluteUrl, createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { formatDate, slugify } from "@/lib/utils";

type SeriesDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const seriesEntries = await getAllSeries();
  return seriesEntries.map((series) => ({ slug: series.slug }));
}

export async function generateMetadata({ params }: SeriesDetailPageProps) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  if (!series) {
    return createPageMetadata({
      title: "专题不存在",
      description: "这个专题暂时没有找到。",
      path: `/series/${slug}`,
    });
  }

  return createPageMetadata({
    title: series.seoTitle ?? series.title,
    description: series.seoDescription ?? series.summary,
    path: `/series/${series.slug}`,
    keywords: [...new Set(series.posts.flatMap((post) => [post.category, ...post.tags]))],
  });
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  if (!series) {
    notFound();
  }

  const seriesJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: series.title,
    description: series.description,
    url: absoluteUrl(`/series/${series.slug}`),
    hasPart: series.posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/blog/${post.slug}`),
      name: post.title,
    })),
  };

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "专题", path: "/series" },
          { name: series.title, path: `/series/${series.slug}` },
        ])}
      />
      <JsonLd data={seriesJsonLd} />

      <section className="glass-panel overflow-hidden rounded-[2.2rem]">
        <div className="relative aspect-[16/7] overflow-hidden">
          <Image
            src={series.cover}
            alt={series.title}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1280px) 70vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-white/10" />
        </div>

        <div className="space-y-6 p-7 sm:p-10">
          <div className="text-muted flex flex-wrap items-center gap-3 text-sm">
            <span className="bg-accent-soft text-accent-strong rounded-full px-4 py-2">
              专题阅读
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Layers3 className="h-4 w-4" />
              {series.totalPosts} 篇文章
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" />约 {series.totalReadingMinutes} 分钟
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              最近更新于 {formatDate(series.updatedAt)}
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-foreground text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              {series.title}
            </h1>
            <p className="text-muted max-w-3xl text-base leading-8 sm:text-lg">
              {series.description}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        {series.posts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="glass-panel hover:border-accent/20 group grid gap-5 rounded-[1.8rem] border border-transparent p-6 transition lg:grid-cols-[5rem_minmax(0,1fr)_auto]"
          >
            <div className="bg-accent-soft text-accent-strong flex h-16 w-16 items-center justify-center rounded-[1.4rem] text-2xl font-semibold">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="min-w-0 space-y-3">
              <div className="text-muted flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-white/45 px-3 py-1 dark:bg-white/8">
                  {post.category}
                </span>
                <span>{formatDate(post.publishedAt)}</span>
                <span>{post.readingTime.text}</span>
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-foreground text-2xl font-semibold tracking-[-0.04em]">
                  {post.title}
                </h2>
                <p className="text-muted text-sm leading-7">{post.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="border-border text-muted rounded-full border bg-white/35 px-3 py-1 text-xs dark:bg-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm lg:flex-col lg:items-end">
              <span className="text-accent-strong rounded-full bg-white/40 px-3 py-1 dark:bg-white/8">
                第 {index + 1} 篇
              </span>
              <span className="text-accent-strong group-hover:text-accent inline-flex items-center gap-1.5">
                进入阅读
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/series"
          className="text-accent-strong hover:text-accent inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          返回专题列表
        </Link>
        <Link
          href={`/categories/${slugify(series.posts[0].category)}`}
          className="text-accent-strong hover:text-accent inline-flex items-center gap-2 text-sm"
        >
          从这个专题的起始分类继续探索
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </>
  );
}
