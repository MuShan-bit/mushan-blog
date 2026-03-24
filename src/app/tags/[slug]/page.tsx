import { notFound } from "next/navigation";
import { PageIntro } from "@/components/content/page-intro";
import { PostCard } from "@/components/content/post-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getPostsByTagSlug, getTagSummaries } from "@/lib/content";
import { createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

type TagPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const tags = await getTagSummaries();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: TagPageProps) {
  const { slug } = await params;
  const tags = await getTagSummaries();
  const tag = tags.find((item) => item.slug === slug);

  return createPageMetadata({
    title: tag ? `#${tag.label}` : "标签",
    description: tag ? `浏览与“${tag.label}”标签相关的文章。` : "标签页",
    path: `/tags/${slug}`,
  });
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tags = await getTagSummaries();
  const tag = tags.find((item) => item.slug === slug);
  const posts = await getPostsByTagSlug(slug);

  if (!tag || posts.length === 0) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "文章", path: "/blog" },
          { name: tag.label, path: `/tags/${tag.slug}` },
        ])}
      />

      <PageIntro
        eyebrow="Tag"
        title={`# ${tag.label}`}
        description={`这个标签目前关联 ${tag.count} 篇文章，适合从更细的兴趣点切入。`}
      />

      <section className="grid gap-5 lg:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </section>
    </>
  );
}
