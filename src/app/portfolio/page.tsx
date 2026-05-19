import { PortfolioCard } from "@/components/content/portfolio-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllPortfolioEntries } from "@/lib/content";
import { createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "作品集",
  description: "木杉的作品集与案例详情页，记录项目背景、过程、成果和技术栈。",
  path: "/portfolio",
  keywords: ["作品集", "案例", "Next.js", "设计驱动开发"],
});

export default async function PortfolioPage() {
  const entries = await getAllPortfolioEntries();

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "作品集", path: "/portfolio" },
        ])}
      />

      <section className="grid gap-5 lg:grid-cols-2">
        {entries.map((entry) => (
          <PortfolioCard key={entry.slug} entry={entry} />
        ))}
      </section>
    </>
  );
}
