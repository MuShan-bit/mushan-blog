"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryPhoto } from "@/lib/types";

type GalleryLightboxProps = {
  albumTitle: string;
  photos: GalleryPhoto[];
};

export function GalleryLightbox({ albumTitle, photos }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => (current === null ? current : (current - 1 + photos.length) % photos.length));
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current === null ? current : (current + 1) % photos.length));
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, photos.length]);

  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  return (
    <>
      <div className="columns-1 gap-5 md:columns-2 xl:columns-3">
        {photos.map((photo, index) => (
          <button
            type="button"
            key={photo.src}
            onClick={() => setActiveIndex(index)}
            className="masonry-card group mb-5 block w-full overflow-hidden rounded-[1.6rem] border border-border bg-surface/70 text-left shadow-[0_20px_70px_rgba(16,34,28,0.08)]"
          >
            <div className="overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="space-y-2 p-4">
              <p className="text-sm font-medium text-foreground">{photo.caption ?? photo.alt}</p>
              {photo.takenAt ? <p className="text-xs text-muted">{photo.takenAt}</p> : null}
            </div>
          </button>
        ))}
      </div>

      {activePhoto ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/78 px-4 py-8 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/10 p-3 text-white hover:bg-white/15"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              setActiveIndex((current) =>
                current === null ? photos.length - 1 : (current - 1 + photos.length) % photos.length,
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-3 text-white hover:bg-white/15"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              setActiveIndex((current) => (current === null ? 0 : (current + 1) % photos.length))
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-3 text-white hover:bg-white/15"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="mx-auto flex max-h-full w-full max-w-5xl flex-col gap-4">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl">
              <Image
                src={activePhoto.src}
                alt={activePhoto.alt}
                width={activePhoto.width}
                height={activePhoto.height}
                className="max-h-[78vh] w-full rounded-[1.5rem] object-contain"
              />
            </div>
            <div className="flex flex-col gap-2 text-white/85 sm:flex-row sm:items-center sm:justify-between">
              <div>
              <p className="font-display text-2xl font-semibold">{albumTitle}</p>
              <p className="text-sm text-white/70">{activePhoto.caption ?? activePhoto.alt}</p>
            </div>
            <p className="text-sm text-white/70">
              {(activeIndex ?? 0) + 1} / {photos.length}
            </p>
          </div>
        </div>
      </div>
      ) : null}
    </>
  );
}
