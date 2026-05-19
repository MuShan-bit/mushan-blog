import { notFound } from "next/navigation";
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
    robots: {
      index: false,
      follow: true,
    },
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

      <section className="grid gap-5 lg:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </section>
    </>
  );
}
