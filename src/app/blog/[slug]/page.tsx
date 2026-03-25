import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, Hash, Layers3 } from "lucide-react";
import { notFound } from "next/navigation";
import { ViewCount } from "@/components/analytics/view-count";
import { ArticleReaderShell } from "@/components/content/article-reader-shell";
import { HeroWaveDivider } from "@/components/content/hero-wave-divider";
import { MdxContent } from "@/components/content/mdx-components";
import { PostCard } from "@/components/content/post-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getPostBySlug, getPublishedPosts } from "@/lib/content";
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
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.summary,
    path: `/blog/${post.slug}`,
    keywords: [post.category, ...post.tags],
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = (await getPublishedPosts())
    .filter((entry) => entry.slug !== post.slug)
    .filter((entry) => entry.category === post.category || entry.tags.some((tag) => post.tags.includes(tag)))
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
            <div className="glass-panel rounded-[1.8rem] p-6">
              <div className="flex items-center gap-3 text-accent-strong">
                <Layers3 className="h-5 w-5" />
                <h2 className="font-medium">文章信息</h2>
              </div>
              <dl className="mt-5 grid gap-4 text-sm">
                <div>
                  <dt className="text-muted">分类</dt>
                  <dd className="mt-1 text-foreground">{post.category}</dd>
                </div>
                <div>
                  <dt className="text-muted">发布时间</dt>
                  <dd className="mt-1 text-foreground">{formatDate(post.publishedAt)}</dd>
                </div>
                {post.updatedAt ? (
                  <div>
                    <dt className="text-muted">更新日期</dt>
                    <dd className="mt-1 text-foreground">{formatDate(post.updatedAt)}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-muted">阅读时长</dt>
                  <dd className="mt-1 text-foreground">{post.readingTime.text}</dd>
                </div>
              </dl>
            </div>

            <div className="glass-panel rounded-[1.8rem] p-6">
              <div className="flex items-center gap-3 text-accent-strong">
                <Hash className="h-5 w-5" />
                <h2 className="font-medium">相关文章</h2>
              </div>
              <div className="mt-5 grid gap-4">
                {relatedPosts.length ? (
                  relatedPosts.map((entry) => (
                    <Link
                      key={entry.slug}
                      href={`/blog/${entry.slug}`}
                      className="rounded-[1.25rem] border border-border bg-white/35 p-4 text-sm hover:border-accent/20 dark:bg-white/5"
                    >
                      <p className="font-medium text-foreground">{entry.title}</p>
                      <p className="mt-2 leading-7 text-muted">{entry.summary}</p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-muted">更多相关文章会随着内容增加逐步丰富起来。</p>
                )}
              </div>
            </div>
          </>
        }
      >
        <header className="article-hero glass-panel overflow-hidden rounded-[2.2rem]">
          <div className="article-hero__media">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1280px) 70vw, 100vw"
            />
            <HeroWaveDivider />
          </div>
          <div className="article-hero__body space-y-6 p-7 sm:p-10">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <Link
                href={`/categories/${slugify(post.category)}`}
                className="rounded-full bg-accent-soft px-4 py-2 text-accent-strong"
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
              <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                {post.title}
              </h1>
              <p className="max-w-3xl text-base leading-8 text-muted sm:text-lg">{post.summary}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${slugify(tag)}`}
                  className="rounded-full border border-border bg-white/35 px-4 py-2 text-sm text-muted hover:border-accent/20 hover:text-accent-strong dark:bg-white/5"
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

      {relatedPosts.length ? (
        <section className="site-grid">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker text-sm font-semibold">Continue Reading</p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                也可以接着读这些
              </h2>
            </div>
            <Link href="/blog" className="text-sm text-accent-strong hover:text-accent">
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
