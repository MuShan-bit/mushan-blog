import Link from "next/link";
import { ArrowRight, BookOpenText, Camera, LayoutPanelLeft } from "lucide-react";
import { AlbumCard } from "@/components/content/album-card";
import { FriendCard } from "@/components/content/friend-card";
import { PortfolioCard } from "@/components/content/portfolio-card";
import { PostCard } from "@/components/content/post-card";
import { HomeHero } from "@/components/home/home-hero";
import { HomeScrollReveal } from "@/components/home/home-scroll-reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { friends } from "@/data/friends";
import { galleryAlbums } from "@/data/gallery";
import { getAllPortfolioEntries, getFeaturedPortfolioEntries, getFeaturedPosts, getPublishedPosts } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = createPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
  keywords: ["木杉", "Next.js 博客", "个人博客", "作品集", "相册", "RSS"],
});

export default async function Home() {
  const [allPosts, allPortfolioEntries, featuredPosts, featuredPortfolioEntries] = await Promise.all([
    getPublishedPosts(),
    getAllPortfolioEntries(),
    getFeaturedPosts(3),
    getFeaturedPortfolioEntries(2),
  ]);
  const featuredAlbums = galleryAlbums.slice(0, 2);
  const featuredFriends = friends.slice(0, 3);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.title,
    url: siteConfig.siteUrl,
    description: siteConfig.description,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />

      <HomeHero
        postCount={allPosts.length}
        portfolioCount={allPortfolioEntries.length}
        albumCount={galleryAlbums.length}
      />

      <HomeScrollReveal id="home-flow" className="site-grid scroll-mt-28" delay={30}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="section-kicker text-sm font-semibold">Latest Posts</p>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground">
              先从最近写的东西开始
            </h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-accent-strong hover:text-accent">
            查看全部文章
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </HomeScrollReveal>

      <HomeScrollReveal className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]" delay={80}>
        <div className="site-grid">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker text-sm font-semibold">Portfolio</p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                最近在做的项目与案例
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm text-accent-strong hover:text-accent"
            >
              进入作品集
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {featuredPortfolioEntries.map((entry) => (
              <PortfolioCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </div>
        <aside className="glass-panel rounded-[2rem] p-6">
          <div className="flex items-center gap-3 text-accent-strong">
            <LayoutPanelLeft className="h-5 w-5" />
            <p className="text-sm font-medium">站点模块</p>
          </div>
          <ul className="mt-5 grid gap-4 text-sm leading-7 text-muted">
            <li className="rounded-2xl border border-border bg-white/35 px-4 py-3 dark:bg-white/5">
              文章支持分类、标签、SEO、RSS 和阅读数展示。
            </li>
            <li className="rounded-2xl border border-border bg-white/35 px-4 py-3 dark:bg-white/5">
              相册走主题瀑布流，适合日常影像与摄影记录。
            </li>
            <li className="rounded-2xl border border-border bg-white/35 px-4 py-3 dark:bg-white/5">
              关于页会用文字粒子重构“木杉”的个人形象。
            </li>
          </ul>
        </aside>
      </HomeScrollReveal>

      <HomeScrollReveal className="site-grid" delay={120}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="section-kicker text-sm font-semibold">Gallery</p>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground">
              把光线、风和街角留下来
            </h2>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm text-accent-strong hover:text-accent"
          >
            浏览全部相册
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {featuredAlbums.map((album) => (
            <AlbumCard key={album.slug} album={album} />
          ))}
        </div>
      </HomeScrollReveal>

      <HomeScrollReveal className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]" delay={160}>
        <div className="site-grid">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker text-sm font-semibold">Friends</p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                也想把喜欢的个人站点放进来
              </h2>
            </div>
            <Link href="/friends" className="inline-flex items-center gap-2 text-sm text-accent-strong hover:text-accent">
              打开友联页
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4">
            {featuredFriends.map((friend) => (
              <FriendCard key={friend.name} friend={friend} />
            ))}
          </div>
        </div>

        <aside className="glass-panel rounded-[2rem] p-6">
          <div className="space-y-5">
            <div className="flex items-center gap-3 text-accent-strong">
              <BookOpenText className="h-5 w-5" />
              <p className="text-sm font-medium">适合长期更新</p>
            </div>
            <p className="text-sm leading-7 text-muted">
              当前内容系统基于本地 MDX，文章、作品和站点配置都能直接跟代码一起维护，静态生成也更利于 SEO。
            </p>
            <div className="rounded-[1.4rem] border border-border bg-white/35 p-4 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm text-accent-strong">
                <Camera className="h-4 w-4" />
                新鲜感
              </div>
              <p className="mt-2 text-sm leading-7 text-muted">
                明暗主题、局部毛玻璃、滚动视差和轻液态动效都控制在“只增强情绪、不打扰阅读”的尺度。
              </p>
            </div>
          </div>
        </aside>
      </HomeScrollReveal>
    </>
  );
}
