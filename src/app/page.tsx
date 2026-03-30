import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowRight, Flag, Github, Handshake, Mail, Target } from "lucide-react";
import { AlbumCard } from "@/components/content/album-card";
import { FriendCard } from "@/components/content/friend-card";
import { PortfolioCard } from "@/components/content/portfolio-card";
import { PostCard } from "@/components/content/post-card";
import { SeriesCard } from "@/components/content/series-card";
import { HomeHero } from "@/components/home/home-hero";
import { HomeScrollReveal } from "@/components/home/home-scroll-reveal";
import { TelepathyContactButton } from "@/components/home/telepathy-contact-button";
import { JsonLd } from "@/components/seo/json-ld";
import { profile } from "@/data/profile";
import { friends } from "@/data/friends";
import { galleryAlbums } from "@/data/gallery";
import {
  getAllPortfolioEntries,
  getFeaturedPortfolioEntries,
  getFeaturedPosts,
  getFeaturedSeries,
  getPublishedPosts,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = createPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
  keywords: ["木杉", "Next.js 博客", "个人博客", "作品集", "相册", "RSS"],
});

export default async function Home() {
  const [allPosts, allPortfolioEntries, featuredPosts, featuredPortfolioEntries, featuredSeries] =
    await Promise.all([
      getPublishedPosts(),
      getAllPortfolioEntries(),
      getFeaturedPosts(3),
      getFeaturedPortfolioEntries(2),
      getFeaturedSeries(2),
    ]);
  const featuredAlbums = galleryAlbums.slice(0, 2);
  const featuredFriends = friends.slice(0, 3);
  const githubUsername = profile.github
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/\/$/, "");
  const nextSteps = [
    "拓展副业（咸鱼AI/开发服务，做自媒体公众号，区块链量化交易等）",
    "深度学习大模型/AI Agent领域",
    "将开源项目 TideDesk 初版开发完善",
  ];

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
            <h2 className="font-display text-foreground mt-2 text-3xl font-semibold tracking-[-0.05em]">
              先从最近写的东西开始
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-accent-strong hover:text-accent inline-flex items-center gap-2 text-sm"
          >
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

      {featuredSeries.length ? (
        <HomeScrollReveal className="site-grid" delay={55}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker text-sm font-semibold">Series</p>
              <h2 className="font-display text-foreground mt-2 text-3xl font-semibold tracking-[-0.05em]">
                适合一口气读下去的专题
              </h2>
            </div>
            <Link
              href="/series"
              className="text-accent-strong hover:text-accent inline-flex items-center gap-2 text-sm"
            >
              浏览全部专题
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {featuredSeries.map((series) => (
              <SeriesCard key={series.slug} series={series} />
            ))}
          </div>
        </HomeScrollReveal>
      ) : null}

      <HomeScrollReveal className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]" delay={80}>
        <div className="site-grid">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker text-sm font-semibold">Portfolio</p>
              <h2 className="font-display text-foreground mt-2 text-3xl font-semibold tracking-[-0.05em]">
                最近在做的项目与案例
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="text-accent-strong hover:text-accent inline-flex items-center gap-2 text-sm"
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
          <div className="text-accent-strong flex items-center gap-3">
            <Activity className="h-5 w-5" />
            <div>
              <p className="text-foreground text-sm font-medium">创作者状态面板</p>
              <p className="text-muted mt-1 text-xs">最近在打磨什么，也顺手留一点工程痕迹。</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="border-border rounded-[1.35rem] border bg-white/35 p-4 dark:bg-white/5">
              <div className="text-accent-strong flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                当前聚焦
              </div>
              <p className="text-muted mt-2 text-sm leading-7">
                最近正在公务员备考，闲暇时间利用AI打磨静态博客和个人开源项目
              </p>
            </div>

            <div className="border-border rounded-[1.35rem] border bg-white/35 p-4 dark:bg-white/5">
              <div className="text-accent-strong flex items-center gap-2 text-sm">
                <Flag className="h-4 w-4" />
                下一步计划
              </div>
              <ul className="text-muted mt-2 grid gap-2 text-sm leading-7">
                {nextSteps.map((step) => (
                  <li key={step} className="flex gap-2">
                    <span className="bg-accent/70 mt-[0.72rem] h-1.5 w-1.5 rounded-full" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-border rounded-[1.45rem] border bg-white/45 p-4 dark:bg-white/6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-foreground text-sm font-medium">GitHub 贡献热力图</p>
                  <p className="text-muted mt-1 text-xs">@{githubUsername}</p>
                </div>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-strong hover:text-accent inline-flex items-center gap-1.5 text-xs"
                >
                  查看 GitHub
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="border-border/80 mt-4 overflow-hidden rounded-[1.1rem] border bg-white p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]">
                <Image
                  src={`/api/github-heatmap?user=${githubUsername}`}
                  alt={`${githubUsername} 的 GitHub 贡献热力图`}
                  width={720}
                  height={160}
                  unoptimized
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </aside>
      </HomeScrollReveal>

      <HomeScrollReveal className="site-grid" delay={120}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="section-kicker text-sm font-semibold">Gallery</p>
            <h2 className="font-display text-foreground mt-2 text-3xl font-semibold tracking-[-0.05em]">
              把光线、风和街角留下来
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-accent-strong hover:text-accent inline-flex items-center gap-2 text-sm"
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

      <HomeScrollReveal className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]" delay={160}>
        <div className="site-grid">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker text-sm font-semibold">Friends</p>
              <h2 className="font-display text-foreground mt-2 text-3xl font-semibold tracking-[-0.05em]">
                开往下一站的列车，从这里开始
              </h2>
            </div>
            <Link
              href="/friends"
              className="text-accent-strong hover:text-accent inline-flex items-center gap-2 text-sm"
            >
              打开友链页
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
            <div className="text-accent-strong flex items-center gap-3">
              <Handshake className="h-5 w-5" />
              <div>
                <p className="text-foreground text-sm font-medium">加入友链</p>
                <p className="text-muted mt-1 text-xs">如果你的小站也在认真生长，欢迎来交换。</p>
              </div>
            </div>

            <div className="border-border rounded-[1.4rem] border bg-white/35 p-4 dark:bg-white/5">
              <p className="text-accent-strong text-sm font-medium">交换方式</p>
              <p className="text-muted mt-3 grid gap-3 text-sm leading-7">
                先把本站加入你的友链页。把站点名、链接、简介、头像和 `RSS`（可选）发给我。通过邮箱或
                GitHub 联系，我会尽快回看并补上。
              </p>
            </div>

            <div className="grid gap-3">
              <a
                href={`mailto:${siteConfig.author.email}?subject=${encodeURIComponent("友链交换 / 木杉的风与代码")}`}
                className="border-border text-foreground hover:border-accent/20 hover:text-accent-strong inline-flex items-center justify-between rounded-[1.1rem] border bg-white/45 px-4 py-3 text-sm dark:bg-white/5"
              >
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  邮箱联系
                </span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="border-border text-foreground hover:border-accent/20 hover:text-accent-strong inline-flex items-center justify-between rounded-[1.1rem] border bg-white/45 px-4 py-3 text-sm dark:bg-white/5"
              >
                <span className="inline-flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub 联系
                </span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <TelepathyContactButton />
            </div>
          </div>
        </aside>
      </HomeScrollReveal>
    </>
  );
}
