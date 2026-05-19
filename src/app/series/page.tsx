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

      <section className="grid gap-5 lg:grid-cols-2">
        {seriesEntries.map((series) => (
          <SeriesCard key={series.slug} series={series} />
        ))}
      </section>
    </>
  );
}
