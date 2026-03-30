import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import { seriesDefinitions } from "@/data/series";
import type { PortfolioEntry, Post, SeriesEntry, TermSummary } from "@/lib/types";
import { slugify, sortByDateDesc } from "@/lib/utils";

const postsDirectory = path.join(process.cwd(), "content", "posts");
const portfolioDirectory = path.join(process.cwd(), "content", "portfolio");

const dateLikeString = z.union([z.string(), z.date()]).transform((value) => {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value;
});

const postSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  publishedAt: dateLikeString,
  updatedAt: dateLikeString.optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  cover: z.string(),
  draft: z.boolean().default(false),
  featured: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const portfolioSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  period: z.string(),
  role: z.string(),
  stack: z.array(z.string()).default([]),
  cover: z.string(),
  links: z
    .array(
      z.object({
        label: z.string(),
        url: z.string().url(),
        type: z.enum(["case", "repo", "demo", "note"]).default("case"),
      }),
    )
    .default([]),
  featured: z.boolean().default(false),
  status: z.enum(["planned", "active", "archived"]).default("active"),
});

async function readCollection<T>(directory: string, schema: z.ZodType<T>) {
  const files = await fs.readdir(directory);

  return Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const source = await fs.readFile(path.join(directory, file), "utf8");
        const { data, content } = matter(source);

        return {
          ...schema.parse(data),
          content,
        };
      }),
  );
}

export const getAllPosts = cache(async (): Promise<Post[]> => {
  const entries = await readCollection(postsDirectory, postSchema);

  return sortByDateDesc(
    entries.map((entry) => {
      const stats = readingTime(entry.content);

      return {
        ...entry,
        readingTime: {
          text: stats.text,
          minutes: Math.ceil(stats.minutes),
          words: stats.words,
        },
      };
    }),
  );
});

export const getPublishedPosts = cache(async () => {
  const posts = await getAllPosts();
  return posts.filter((post) => !post.draft);
});

export const getFeaturedPosts = cache(async (limit = 3) => {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.featured).slice(0, limit);
});

export const getPostBySlug = cache(async (slug: string) => {
  const posts = await getPublishedPosts();
  return posts.find((post) => post.slug === slug) ?? null;
});

export const getAllPortfolioEntries = cache(async (): Promise<PortfolioEntry[]> => {
  const entries = await readCollection(portfolioDirectory, portfolioSchema);

  return entries.sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }

    return a.title.localeCompare(b.title, "zh-CN");
  });
});

export const getFeaturedPortfolioEntries = cache(async (limit = 2) => {
  const entries = await getAllPortfolioEntries();
  return entries.filter((entry) => entry.featured).slice(0, limit);
});

export const getPortfolioEntryBySlug = cache(async (slug: string) => {
  const entries = await getAllPortfolioEntries();
  return entries.find((entry) => entry.slug === slug) ?? null;
});

function buildTermSummaries(values: string[]) {
  const counter = new Map<string, number>();

  values.forEach((value) => {
    const current = counter.get(value) ?? 0;
    counter.set(value, current + 1);
  });

  return [...counter.entries()]
    .map(([label, count]) => ({
      label,
      slug: slugify(label),
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "zh-CN"));
}

export const getCategorySummaries = cache(async (): Promise<TermSummary[]> => {
  const posts = await getPublishedPosts();
  return buildTermSummaries(posts.map((post) => post.category));
});

export const getTagSummaries = cache(async (): Promise<TermSummary[]> => {
  const posts = await getPublishedPosts();
  return buildTermSummaries(posts.flatMap((post) => post.tags));
});

export const getPostsByCategorySlug = cache(async (slug: string) => {
  const posts = await getPublishedPosts();
  return posts.filter((post) => slugify(post.category) === slug);
});

export const getPostsByTagSlug = cache(async (slug: string) => {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.tags.some((tag) => slugify(tag) === slug));
});

export const getAllSeries = cache(async (): Promise<SeriesEntry[]> => {
  const posts = await getPublishedPosts();
  const postsBySlug = new Map(posts.map((post) => [post.slug, post]));

  const entries = seriesDefinitions.reduce<SeriesEntry[]>((collection, series) => {
    if (series.postSlugs.length === 0) {
      return collection;
    }

    const orderedPosts = series.postSlugs.map((postSlug) => {
      const post = postsBySlug.get(postSlug);

      if (!post) {
        throw new Error(`Series "${series.slug}" references unknown post slug "${postSlug}".`);
      }

      return post;
    });

    const updatedAt = orderedPosts.reduce((latest, post) => {
      const candidate = post.updatedAt ?? post.publishedAt;

      return new Date(candidate).getTime() > new Date(latest).getTime() ? candidate : latest;
    }, orderedPosts[0].updatedAt ?? orderedPosts[0].publishedAt);

    collection.push({
      title: series.title,
      slug: series.slug,
      summary: series.summary,
      description: series.description,
      cover: series.cover,
      featured: series.featured,
      seoTitle: series.seoTitle,
      seoDescription: series.seoDescription,
      posts: orderedPosts,
      totalPosts: orderedPosts.length,
      totalReadingMinutes: orderedPosts.reduce(
        (total, post) => total + post.readingTime.minutes,
        0,
      ),
      updatedAt,
    });

    return collection;
  }, []);

  return entries.sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }

    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
});

export const getFeaturedSeries = cache(async (limit = 2) => {
  const series = await getAllSeries();
  return series.filter((entry) => entry.featured).slice(0, limit);
});

export const getSeriesBySlug = cache(async (slug: string) => {
  const series = await getAllSeries();
  return series.find((entry) => entry.slug === slug) ?? null;
});

export const getSeriesForPost = cache(async (postSlug: string) => {
  const series = await getAllSeries();
  return series.find((entry) => entry.posts.some((post) => post.slug === postSlug)) ?? null;
});

export const getSeriesNavigationForPost = cache(async (postSlug: string) => {
  const series = await getSeriesForPost(postSlug);

  if (!series) {
    return null;
  }

  const index = series.posts.findIndex((post) => post.slug === postSlug);

  if (index < 0) {
    return null;
  }

  return {
    series,
    index,
    previousPost: index > 0 ? series.posts[index - 1] : null,
    nextPost: index < series.posts.length - 1 ? series.posts[index + 1] : null,
  };
});
