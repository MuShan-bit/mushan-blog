import Link from "next/link";
import { Hash, Layers3 } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { PostCard } from "@/components/content/post-card";
import { getCategorySummaries, getPublishedPosts, getTagSummaries } from "@/lib/content";
import { createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = createPageMetadata({
  title: "文章",
  description: "木杉的博客文章列表，包含技术、设计、摄影与个人记录。",
  path: "/blog",
  keywords: ["博客文章", "分类", "标签", "技术写作"],
});

export default async function BlogPage() {
  const [posts, categories, tags] = await Promise.all([
    getPublishedPosts(),
    getCategorySummaries(),
    getTagSummaries(),
  ]);

  const breadcrumb = createBreadcrumbJsonLd([
    { name: "首页", path: "/" },
    { name: "文章", path: "/blog" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />

      <PageIntro
        eyebrow="Blog"
        title="文章与长期记录"
        description="这里是整个站点的主轴，技术实践、设计观察、影像笔记和生活写作都会在这里累积。"
      />

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-5 lg:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <aside className="space-y-5">
          <div className="glass-panel rounded-[1.8rem] p-6">
            <div className="text-accent-strong flex items-center gap-3">
              <Layers3 className="h-5 w-5" />
              <h2 className="font-medium">分类</h2>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="border-border text-muted hover:border-accent/20 hover:text-accent-strong rounded-full border bg-white/35 px-4 py-2 text-sm dark:bg-white/5"
                >
                  {category.label} · {category.count}
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[1.8rem] p-6">
            <div className="text-accent-strong flex items-center gap-3">
              <Hash className="h-5 w-5" />
              <h2 className="font-medium">标签</h2>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="border-border text-muted hover:border-accent/20 hover:text-accent-strong rounded-full border bg-white/35 px-4 py-2 text-sm dark:bg-white/5"
                >
                  {tag.label} · {tag.count}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
