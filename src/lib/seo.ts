import type { Metadata } from "next";
import type { Post, ProfileConfig } from "@/lib/types";
import { siteConfig } from "@/lib/site";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${siteConfig.siteUrl}${path}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: MetadataInput): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.title,
      locale: "zh_CN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function createArticleJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.summary,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    articleSection: post.category,
    keywords: post.tags.join(", "),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    image: absoluteUrl(post.cover),
  };
}

export function createPersonJsonLd(profile: ProfileConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    description: profile.intro,
    url: absoluteUrl("/about"),
    image: absoluteUrl(profile.portraitAsset),
    sameAs: [profile.github, ...profile.contacts.map((item) => item.href)],
    jobTitle: profile.headline,
  };
}

export function createBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
