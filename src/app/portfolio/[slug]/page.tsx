import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleReaderShell } from "@/components/content/article-reader-shell";
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
            <h2 className="text-accent-strong font-medium">项目链接</h2>
            <div className="mt-5 grid gap-3">
              {entry.links.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="border-border text-foreground hover:border-accent/20 hover:text-accent-strong flex items-center justify-between rounded-[1.2rem] border bg-white/35 px-4 py-3 text-sm dark:bg-white/5"
                >
                  <span>
                    {link.label}
                    <span className="text-muted ml-2 text-xs">{link.type}</span>
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        }
      >
        <>
          <header className="glass-panel overflow-hidden rounded-[2.2rem]">
            <div className="relative aspect-[16/8] overflow-hidden">
              <Image
                src={entry.cover}
                alt={entry.title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1280px) 70vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
            </div>
            <div className="space-y-6 p-7 sm:p-10">
              <div className="text-muted flex flex-wrap items-center gap-3 text-sm">
                <span className="bg-accent-soft text-accent-strong rounded-full px-4 py-2">
                  {entry.role}
                </span>
                <span>{entry.period}</span>
                <span className="border-border inline-flex items-center gap-1.5 rounded-full border px-4 py-2">
                  <Sparkles className="h-4 w-4" />
                  {entry.status === "active"
                    ? "进行中"
                    : entry.status === "planned"
                      ? "筹备中"
                      : "已归档"}
                </span>
              </div>
              <div className="space-y-4">
                <h1 className="font-display text-foreground text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                  {entry.title}
                </h1>
                <p className="text-muted max-w-3xl text-base leading-8 sm:text-lg">
                  {entry.summary}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.stack.map((stackItem) => (
                  <span
                    key={stackItem}
                    className="border-border text-muted rounded-full border bg-white/35 px-4 py-2 text-sm dark:bg-white/5"
                  >
                    {stackItem}
                  </span>
                ))}
              </div>
            </div>
          </header>

          <section className="glass-panel rounded-[2.2rem] p-7 sm:p-10 md:hidden">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-accent-strong font-medium">项目链接</h2>
              <span className="text-muted text-xs">手机端内联展示</span>
            </div>
            <div className="mt-5 grid gap-3">
              {entry.links.map((link) => (
                <Link
                  key={`${link.url}-mobile`}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="border-border text-foreground hover:border-accent/20 hover:text-accent-strong flex items-center justify-between rounded-[1.2rem] border bg-white/35 px-4 py-3 text-sm dark:bg-white/5"
                >
                  <span>
                    {link.label}
                    <span className="text-muted ml-2 text-xs">{link.type}</span>
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
