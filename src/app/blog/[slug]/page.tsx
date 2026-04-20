import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Hash, Layers3 } from "lucide-react";
import { notFound } from "next/navigation";
import { ViewCount } from "@/components/analytics/view-count";
import { ArticleReaderShell } from "@/components/content/article-reader-shell";
import { MdxContent } from "@/components/content/mdx-components";
import { PostCard } from "@/components/content/post-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getPostBySlug, getPublishedPosts, getSeriesNavigationForPost } from "@/lib/content";
import { createArticleJsonLd, createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { formatDate, slugify } from "@/lib/utils";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return createPageMetadata({
      title: "文章不存在",
      description: "这篇文章暂时没有找到。",
      path: `/blog/${slug}`,
    });
  }

  return createPageMetadata({
    title: post.title,
    description: post.seoDescription ?? post.summary,
    path: `/blog/${post.slug}`,
    keywords: [post.category, ...post.tags],
    openGraphType: "article",
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const seriesNavigation = await getSeriesNavigationForPost(post.slug);

  const relatedPosts = (await getPublishedPosts())
    .filter((entry) => entry.slug !== post.slug)
    .filter(
      (entry) =>
        entry.category === post.category || entry.tags.some((tag) => post.tags.includes(tag)),
    )
    .slice(0, 2);

  return (
    <>
      <JsonLd data={createArticleJsonLd(post)} />
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "文章", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <ArticleReaderShell
        shareTitle={post.title}
        sidebar={
          <>
            {seriesNavigation ? (
              <div className="glass-panel rounded-[1.8rem] p-6">
                <div className="text-accent-strong flex items-center gap-3">
                  <Layers3 className="h-5 w-5" />
                  <h2 className="font-medium">当前专题</h2>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <Link
                      href={`/series/${seriesNavigation.series.slug}`}
                      className="text-foreground hover:text-accent-strong font-medium"
                    >
                      {seriesNavigation.series.title}
                    </Link>
                    <p className="text-muted mt-2 text-sm leading-7">
                      这是该专题的第 {seriesNavigation.index + 1} 篇，共{" "}
                      {seriesNavigation.series.totalPosts} 篇。
                    </p>
                  </div>

                  <div className="grid gap-2">
                    {seriesNavigation.series.posts.map((entry, index) => {
                      const isCurrent = entry.slug === post.slug;

                      return (
                        <Link
                          key={entry.slug}
                          href={`/blog/${entry.slug}`}
                          aria-current={isCurrent ? "page" : undefined}
                          className={`rounded-[1.2rem] border p-3 text-sm transition ${
                            isCurrent
                              ? "border-accent/30 bg-accent-soft text-accent-strong"
                              : "border-border text-muted hover:border-accent/20 hover:text-accent-strong bg-white/35 dark:bg-white/5"
                          }`}
                        >
                          <span className="block text-xs opacity-75">第 {index + 1} 篇</span>
                          <span className="mt-1 block leading-6">{entry.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="glass-panel rounded-[1.8rem] p-6">
              <div className="text-accent-strong flex items-center gap-3">
                <Layers3 className="h-5 w-5" />
                <h2 className="font-medium">文章信息</h2>
              </div>
              <dl className="mt-5 grid gap-4 text-sm">
                <div>
                  <dt className="text-muted">分类</dt>
                  <dd className="text-foreground mt-1">{post.category}</dd>
                </div>
                <div>
                  <dt className="text-muted">发布时间</dt>
                  <dd className="text-foreground mt-1">{formatDate(post.publishedAt)}</dd>
                </div>
                {post.updatedAt ? (
                  <div>
                    <dt className="text-muted">更新日期</dt>
                    <dd className="text-foreground mt-1">{formatDate(post.updatedAt)}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-muted">阅读时长</dt>
                  <dd className="text-foreground mt-1">{post.readingTime.text}</dd>
                </div>
              </dl>
            </div>

            <div className="glass-panel rounded-[1.8rem] p-6">
              <div className="text-accent-strong flex items-center gap-3">
                <Hash className="h-5 w-5" />
                <h2 className="font-medium">相关文章</h2>
              </div>
              <div className="mt-5 grid gap-4">
                {relatedPosts.length ? (
                  relatedPosts.map((entry) => (
                    <Link
                      key={entry.slug}
                      href={`/blog/${entry.slug}`}
                      className="border-border hover:border-accent/20 rounded-[1.25rem] border bg-white/35 p-4 text-sm dark:bg-white/5"
                    >
                      <p className="text-foreground font-medium">{entry.title}</p>
                      <p className="text-muted mt-2 leading-7">{entry.summary}</p>
                    </Link>
                  ))
                ) : (
                  <p className="text-muted text-sm leading-7">
                    更多相关文章会随着内容增加逐步丰富起来。
                  </p>
                )}
              </div>
            </div>
          </>
        }
      >
        <header className="glass-panel overflow-hidden rounded-[2.2rem]">
          <div className="relative aspect-[16/8] overflow-hidden">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1280px) 70vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
          </div>
          <div className="space-y-6 p-7 sm:p-10">
            <div className="text-muted flex flex-wrap items-center gap-3 text-sm">
              {seriesNavigation ? (
                <Link
                  href={`/series/${seriesNavigation.series.slug}`}
                  className="bg-accent-soft text-accent-strong rounded-full px-4 py-2"
                >
                  {seriesNavigation.series.title} · 第 {seriesNavigation.index + 1} 篇
                </Link>
              ) : null}
              <Link
                href={`/categories/${slugify(post.category)}`}
                className="bg-accent-soft text-accent-strong rounded-full px-4 py-2"
              >
                {post.category}
              </Link>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" />
                {post.readingTime.text}
              </span>
              <ViewCount path={`/blog/${post.slug}`} />
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-foreground text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                {post.title}
              </h1>
              <p className="text-muted max-w-3xl text-base leading-8 sm:text-lg">{post.summary}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${slugify(tag)}`}
                  className="border-border text-muted hover:border-accent/20 hover:text-accent-strong rounded-full border bg-white/35 px-4 py-2 text-sm dark:bg-white/5"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </header>

        <section className="glass-panel rounded-[2.2rem] p-7 sm:p-10">
          <MdxContent source={post.content} />
        </section>
      </ArticleReaderShell>

      {seriesNavigation ? (
        <section className="site-grid">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker text-sm font-semibold">Series Navigation</p>
              <h2 className="font-display text-foreground mt-2 text-3xl font-semibold tracking-[-0.05em]">
                顺着专题继续读下去
              </h2>
            </div>
            <Link
              href={`/series/${seriesNavigation.series.slug}`}
              className="text-accent-strong hover:text-accent text-sm"
            >
              查看专题全貌
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {seriesNavigation.previousPost ? (
              <Link
                href={`/blog/${seriesNavigation.previousPost.slug}`}
                className="glass-panel hover:border-accent/20 rounded-[1.8rem] border border-transparent p-6 transition"
              >
                <p className="text-muted inline-flex items-center gap-2 text-sm">
                  <ArrowLeft className="h-4 w-4" />
                  上一篇
                </p>
                <h3 className="font-display text-foreground mt-4 text-2xl font-semibold tracking-[-0.04em]">
                  {seriesNavigation.previousPost.title}
                </h3>
                <p className="text-muted mt-3 text-sm leading-7">
                  {seriesNavigation.previousPost.summary}
                </p>
              </Link>
            ) : (
              <div className="glass-panel rounded-[1.8rem] p-6">
                <p className="text-muted text-sm">这是这个专题的第一篇，已经到起点了。</p>
              </div>
            )}

            {seriesNavigation.nextPost ? (
              <Link
                href={`/blog/${seriesNavigation.nextPost.slug}`}
                className="glass-panel hover:border-accent/20 rounded-[1.8rem] border border-transparent p-6 transition"
              >
                <p className="text-muted inline-flex items-center gap-2 text-sm">
                  下一篇
                  <ArrowRight className="h-4 w-4" />
                </p>
                <h3 className="font-display text-foreground mt-4 text-2xl font-semibold tracking-[-0.04em]">
                  {seriesNavigation.nextPost.title}
                </h3>
                <p className="text-muted mt-3 text-sm leading-7">
                  {seriesNavigation.nextPost.summary}
                </p>
              </Link>
            ) : (
              <div className="glass-panel rounded-[1.8rem] p-6">
                <p className="text-muted text-sm">这是这个专题的最后一篇，已经读到终点了。</p>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {relatedPosts.length ? (
        <section className="site-grid">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker text-sm font-semibold">Continue Reading</p>
              <h2 className="font-display text-foreground mt-2 text-3xl font-semibold tracking-[-0.05em]">
                也可以接着读这些
              </h2>
            </div>
            <Link href="/blog" className="text-accent-strong hover:text-accent text-sm">
              返回文章列表
            </Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {relatedPosts.map((entry) => (
              <PostCard key={entry.slug} post={entry} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
