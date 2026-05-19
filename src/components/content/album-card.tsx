import Image from "next/image";
import Link from "next/link";
import { Camera, ArrowUpRight } from "lucide-react";
import { InteractiveCard } from "@/components/content/interactive-card";
import type { GalleryAlbum } from "@/lib/types";

export function AlbumCard({ album }: { album: GalleryAlbum }) {
  const previewPhotos = album.photos.length
    ? album.photos.slice(0, 3)
    : [
        { src: album.cover, alt: album.title },
        { src: album.cover, alt: album.title },
        { src: album.cover, alt: album.title },
      ];

  return (
    <InteractiveCard className="glass-panel album-folder-card group rounded-[1.75rem] p-4 sm:p-5">
      <div className="album-folder-visual relative aspect-[4/3]">
        <div className="album-folder-shell">
          <div className="album-folder-deck">
            <div className="album-folder-photo album-folder-photo--1">
              <Image
                src={previewPhotos[0].src}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 24vw, 88vw"
              />
            </div>
            <div className="album-folder-photo album-folder-photo--2">
              <Image
                src={previewPhotos[1]?.src ?? previewPhotos[0].src}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 24vw, 88vw"
              />
            </div>
            <div className="album-folder-photo album-folder-photo--3">
              <Image
                src={previewPhotos[2]?.src ?? previewPhotos[0].src}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 24vw, 88vw"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 px-2 pb-2">
        <div className="text-muted flex items-center justify-between gap-3 text-sm">
          <span className="bg-accent-soft text-accent-strong rounded-full px-3 py-1">
            {album.theme}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Camera className="h-4 w-4" />
            {album.photos.length} 张
          </span>
        </div>
        <Link
          href={`/gallery/${album.slug}`}
          className="group/title inline-flex items-center gap-2"
        >
          <h2 className="font-display text-foreground text-2xl font-semibold tracking-[-0.04em]">
            {album.title}
          </h2>
          <ArrowUpRight className="text-muted group-hover/title:text-accent-strong h-4 w-4 transition group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5" />
        </Link>
        <p className="text-muted text-sm leading-7">{album.description}</p>
      </div>
    </InteractiveCard>
  );
}
