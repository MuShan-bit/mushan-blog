import type { MetadataRoute } from "next";
import {
  getAllPortfolioEntries,
  getCategorySummaries,
  getPublishedPosts,
  getTagSummaries,
} from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { galleryAlbums } from "@/data/gallery";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, portfolioEntries, categories, tags] = await Promise.all([
    getPublishedPosts(),
    getAllPortfolioEntries(),
    getCategorySummaries(),
    getTagSummaries(),
  ]);

  const staticPages = ["", "/blog", "/portfolio", "/gallery", "/friends", "/about"].map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
    lastModified: new Date(),
  }));

  return [
    ...staticPages,
    ...posts.map((post) => ({
      url: `${siteConfig.siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
    })),
    ...portfolioEntries.map((entry) => ({
      url: `${siteConfig.siteUrl}/portfolio/${entry.slug}`,
      lastModified: new Date(),
    })),
    ...galleryAlbums.map((album) => ({
      url: `${siteConfig.siteUrl}/gallery/${album.slug}`,
      lastModified: new Date(),
    })),
    ...categories.map((category) => ({
      url: `${siteConfig.siteUrl}/categories/${category.slug}`,
      lastModified: new Date(),
    })),
    ...tags.map((tag) => ({
      url: `${siteConfig.siteUrl}/tags/${tag.slug}`,
      lastModified: new Date(),
    })),
  ];
}
