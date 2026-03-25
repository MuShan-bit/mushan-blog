import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleReaderShell } from "@/components/content/article-reader-shell";
import { HeroWaveDivider } from "@/components/content/hero-wave-divider";
import { MdxContent } from "@/components/content/mdx-components";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllPortfolioEntries, getPortfolioEntryBySlug } from "@/lib/content";
import { createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

type PortfolioDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const entries = await getAllPortfolioEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PortfolioDetailPageProps) {
  const { slug } = await params;
  const entry = await getPortfolioEntryBySlug(slug);

  return createPageMetadata({
    title: entry ? entry.title : "作品不存在",
    description: entry ? entry.summary : "这项作品暂时没有找到。",
    path: `/portfolio/${slug}`,
    keywords: entry?.stack ?? [],
  });
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { slug } = await params;
  const entry = await getPortfolioEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "作品集", path: "/portfolio" },
          { name: entry.title, path: `/portfolio/${entry.slug}` },
        ])}
      />

      <ArticleReaderShell
        shareTitle={entry.title}
        sidebar={
          <div className="glass-panel rounded-[1.8rem] p-6">
            <h2 className="font-medium text-accent-strong">项目链接</h2>
            <div className="mt-5 grid gap-3">
              {entry.links.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-[1.2rem] border border-border bg-white/35 px-4 py-3 text-sm text-foreground hover:border-accent/20 hover:text-accent-strong dark:bg-white/5"
                >
                  <span>
                    {link.label}
                    <span className="ml-2 text-xs text-muted">{link.type}</span>
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        }
      >
        <>
          <header className="article-hero glass-panel overflow-hidden rounded-[2.2rem]">
            <div className="article-hero__media">
              <Image
                src={entry.cover}
                alt={entry.title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1280px) 70vw, 100vw"
              />
              <HeroWaveDivider />
            </div>
            <div className="article-hero__body space-y-6 p-7 sm:p-10">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                <span className="rounded-full bg-accent-soft px-4 py-2 text-accent-strong">{entry.role}</span>
                <span>{entry.period}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2">
                  <Sparkles className="h-4 w-4" />
                  {entry.status === "active" ? "进行中" : entry.status === "planned" ? "筹备中" : "已归档"}
                </span>
              </div>
              <div className="space-y-4">
                <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                  {entry.title}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-muted sm:text-lg">{entry.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.stack.map((stackItem) => (
                  <span
                    key={stackItem}
                    className="rounded-full border border-border bg-white/35 px-4 py-2 text-sm text-muted dark:bg-white/5"
                  >
                    {stackItem}
                  </span>
                ))}
              </div>
            </div>
          </header>

          <section className="glass-panel rounded-[2.2rem] p-7 md:hidden sm:p-10">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-medium text-accent-strong">项目链接</h2>
              <span className="text-xs text-muted">手机端内联展示</span>
            </div>
            <div className="mt-5 grid gap-3">
              {entry.links.map((link) => (
                <Link
                  key={`${link.url}-mobile`}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-[1.2rem] border border-border bg-white/35 px-4 py-3 text-sm text-foreground hover:border-accent/20 hover:text-accent-strong dark:bg-white/5"
                >
                  <span>
                    {link.label}
                    <span className="ml-2 text-xs text-muted">{link.type}</span>
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </section>

          <section className="glass-panel rounded-[2.2rem] p-7 sm:p-10">
            <MdxContent source={entry.content} />
          </section>
        </>
      </ArticleReaderShell>
    </>
  );
}
