import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
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

      <PageIntro
        eyebrow="Portfolio"
        title="作品集与案例细节"
        description="我更喜欢完整讲清一个项目从起点到落地的过程，所以每个作品都保留独立详情页，能把背景、决策与结果一起记下来。"
        actions={
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/45 px-5 py-3 text-sm text-foreground hover:border-accent/20 hover:text-accent-strong dark:bg-white/5"
          >
            了解我的能力地图
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-5 lg:grid-cols-2">
        {entries.map((entry) => (
          <PortfolioCard key={entry.slug} entry={entry} />
        ))}
      </section>
    </>
  );
}
