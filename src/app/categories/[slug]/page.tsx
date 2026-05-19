import { notFound } from "next/navigation";
import { PostCard } from "@/components/content/post-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getCategorySummaries, getPostsByCategorySlug } from "@/lib/content";
import { createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const categories = await getCategorySummaries();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await getCategorySummaries();
  const category = categories.find((item) => item.slug === slug);

  return createPageMetadata({
    title: category ? `${category.label} 分类` : "分类",
    description: category ? `浏览“${category.label}”分类下的全部文章。` : "分类页",
    path: `/categories/${slug}`,
    robots: {
      index: false,
      follow: true,
    },
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await getCategorySummaries();
  const category = categories.find((item) => item.slug === slug);
  const posts = await getPostsByCategorySlug(slug);

  if (!category || posts.length === 0) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "文章", path: "/blog" },
          { name: category.label, path: `/categories/${category.slug}` },
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
