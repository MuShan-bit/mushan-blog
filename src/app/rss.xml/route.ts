import { getPublishedPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPublishedPosts();

  const items = posts
    .map((post) => {
      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${absoluteUrl(`/blog/${post.slug}`)}</link>
          <guid>${absoluteUrl(`/blog/${post.slug}`)}</guid>
          <description>${escapeXml(post.summary)}</description>
          <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
          <category>${escapeXml(post.category)}</category>
          ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("")}
        </item>
      `;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${escapeXml(siteConfig.title)}</title>
      <link>${siteConfig.siteUrl}</link>
      <description>${escapeXml(siteConfig.description)}</description>
      <language>zh-CN</language>
      <lastBuildDate>${new Date(posts[0]?.publishedAt ?? Date.now()).toUTCString()}</lastBuildDate>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
