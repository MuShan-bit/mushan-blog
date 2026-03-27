import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import { JsonLd } from "@/components/seo/json-ld";
import { galleryAlbums, getGalleryAlbumBySlug } from "@/data/gallery";
import { createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

type GalleryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return galleryAlbums.map((album) => ({ slug: album.slug }));
}

export async function generateMetadata({ params }: GalleryDetailPageProps) {
  const { slug } = await params;
  const album = getGalleryAlbumBySlug(slug);

  return createPageMetadata({
    title: album ? album.title : "相册不存在",
    description: album ? album.description : "这本相册暂时没有找到。",
    path: `/gallery/${slug}`,
    keywords: album ? [album.theme, "相册", "摄影"] : [],
  });
}

export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
  const { slug } = await params;
  const album = getGalleryAlbumBySlug(slug);

  if (!album) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "相册", path: "/gallery" },
          { name: album.title, path: `/gallery/${album.slug}` },
        ])}
      />

      <section className="glass-panel rounded-[2.2rem] p-7 sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="section-kicker text-sm font-semibold">{album.theme}</p>
            <h1 className="font-display text-foreground text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              {album.title}
            </h1>
            <p className="text-muted text-base leading-8 sm:text-lg">{album.description}</p>
          </div>
          <Link href="/gallery" className="text-accent-strong hover:text-accent text-sm">
            返回相册首页
          </Link>
        </div>
      </section>

      <GalleryLightbox albumTitle={album.title} photos={album.photos} />
    </>
  );
}
