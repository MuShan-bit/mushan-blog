import { NextRequest, NextResponse } from "next/server";
import { galleryAlbums } from "@/data/gallery";
import { getAllPortfolioEntries, getAllSeries, getPublishedPosts } from "@/lib/content";

export const runtime = "nodejs";

type SearchOption = {
  id: string;
  kind: "post" | "portfolio" | "gallery" | "series";
  title: string;
  summary: string;
  href: string;
  meta: string;
};

function normalizeQuery(value: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function includesQuery(text: string, query: string) {
  if (!query) {
    return true;
  }

  return text.toLowerCase().includes(query);
}

export async function GET(request: NextRequest) {
  const query = normalizeQuery(request.nextUrl.searchParams.get("q"));
  const [posts, portfolioEntries, seriesEntries] = await Promise.all([
    getPublishedPosts(),
    getAllPortfolioEntries(),
    getAllSeries(),
  ]);

  const options: SearchOption[] = [
    ...posts.map((post) => ({
      id: `post-${post.slug}`,
      kind: "post" as const,
      title: post.title,
      summary: post.summary,
      href: `/blog/${post.slug}`,
      meta: post.category,
    })),
    ...portfolioEntries.map((entry) => ({
      id: `portfolio-${entry.slug}`,
      kind: "portfolio" as const,
      title: entry.title,
      summary: entry.summary,
      href: `/portfolio/${entry.slug}`,
      meta: entry.role,
    })),
    ...galleryAlbums.map((album) => ({
      id: `gallery-${album.slug}`,
      kind: "gallery" as const,
      title: album.title,
      summary: album.description,
      href: `/gallery/${album.slug}`,
      meta: album.theme,
    })),
    ...seriesEntries.map((entry) => ({
      id: `series-${entry.slug}`,
      kind: "series" as const,
      title: entry.title,
      summary: entry.summary,
      href: `/series/${entry.slug}`,
      meta: `${entry.totalPosts} 篇`,
    })),
  ];

  const filtered = options.filter((option) =>
    includesQuery(`${option.title} ${option.summary} ${option.meta}`, query),
  );

  return NextResponse.json(
    {
      options: filtered,
      total: filtered.length,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
