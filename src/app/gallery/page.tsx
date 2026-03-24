import { PageIntro } from "@/components/content/page-intro";
import { AlbumCard } from "@/components/content/album-card";
import { JsonLd } from "@/components/seo/json-ld";
import { galleryAlbums } from "@/data/gallery";
import { createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "相册",
  description: "主题瀑布流形式的个人相册页面，记录城市、植物与夜色。",
  path: "/gallery",
  keywords: ["相册", "摄影", "瀑布流", "主题相册"],
});

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "相册", path: "/gallery" },
        ])}
      />

      <PageIntro
        eyebrow="Gallery"
        title="主题相册与视觉片段"
        description="相册不按时间线排列，而是按氛围和主题展开。这样每个系列都能保持自己的情绪和光线。"
      />

      <section className="grid gap-5 lg:grid-cols-3">
        {galleryAlbums.map((album) => (
          <AlbumCard key={album.slug} album={album} />
        ))}
      </section>
    </>
  );
}
