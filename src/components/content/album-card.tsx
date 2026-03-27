import Image from "next/image";
import Link from "next/link";
import { Camera, ArrowUpRight } from "lucide-react";
import { InteractiveCard } from "@/components/content/interactive-card";
import type { GalleryAlbum } from "@/lib/types";

export function AlbumCard({ album }: { album: GalleryAlbum }) {
  return (
    <InteractiveCard className="glass-panel group overflow-hidden rounded-[1.75rem]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={album.cover}
          alt={album.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 30vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
      </div>
      <div className="space-y-3 p-6">
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
