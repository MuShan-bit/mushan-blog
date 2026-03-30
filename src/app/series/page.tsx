import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { SeriesCard } from "@/components/content/series-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllSeries } from "@/lib/content";
import { createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "专题",
  description: "把多篇相关文章按顺序串起来，适合从一个主题连续读下去。",
  path: "/series",
  keywords: ["专题", "系列文章", "顺序阅读", "博客专栏"],
});

export default async function SeriesPage() {
  const seriesEntries = await getAllSeries();

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "专题", path: "/series" },
        ])}
      />

      <PageIntro
        eyebrow="Series"
        title="专题与连续阅读"
        description="这里把同一主题下的多篇文章按顺序组织起来。比起零散地跳着看，它更适合从一个问题出发，连续读到一个阶段性的答案。"
        actions={
          <Link
            href="/blog"
            className="border-border text-accent-strong hover:border-accent/20 hover:text-accent inline-flex items-center gap-2 rounded-full border bg-white/40 px-4 py-2 text-sm dark:bg-white/5"
          >
            返回文章列表
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-5 lg:grid-cols-2">
          {seriesEntries.map((series) => (
            <SeriesCard key={series.slug} series={series} />
          ))}
        </div>

        <aside className="space-y-5">
          <div className="glass-panel rounded-[1.8rem] p-6">
            <div className="text-accent-strong flex items-center gap-3">
              <Layers3 className="h-5 w-5" />
              <h2 className="font-medium">怎么阅读专题</h2>
            </div>
            <div className="text-muted mt-5 space-y-3 text-sm leading-7">
              <p>专题会把多篇文章按顺序排好，适合从头开始连续读。</p>
              <p>如果你只想快速进入，也可以先点任何一篇，再从文章页里的专题导航继续往下读。</p>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
