import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowRight, Clock3, Flag, Github, Handshake, Mail, Target, Wrench } from "lucide-react";
import { AlbumCard } from "@/components/content/album-card";
import { FriendCard } from "@/components/content/friend-card";
import { PortfolioCard } from "@/components/content/portfolio-card";
import { PostCard } from "@/components/content/post-card";
import { HomeHero } from "@/components/home/home-hero";
import { HomeScrollReveal } from "@/components/home/home-scroll-reveal";
import { TelepathyContactButton } from "@/components/home/telepathy-contact-button";
import { JsonLd } from "@/components/seo/json-ld";
import { profile } from "@/data/profile";
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
  const githubUsername = profile.github.replace(/^https?:\/\/github\.com\//i, "").replace(/\/$/, "");
  const creatorKeywords = ["Next.js", "TypeScript", "MDX", "Supabase", "React Three Fiber", "SEO"];
  const nextSteps = ["补更多真实项目案例", "替换 About 页真实素材", "继续收紧移动端与阅读体验细节"];
  const linkTopics = ["独立博客", "设计", "开发", "摄影", "写作", "RSS"];

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

      <HomeScrollReveal className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]" delay={80}>
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
            <Activity className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium text-foreground">创作者状态面板</p>
              <p className="mt-1 text-xs text-muted">最近在打磨什么，也顺手留一点工程痕迹。</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="rounded-[1.35rem] border border-border bg-white/35 p-4 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm text-accent-strong">
                <Target className="h-4 w-4" />
                当前聚焦
              </div>
              <p className="mt-2 text-sm leading-7 text-muted">
                把博客内容体验继续打磨稳，同时慢慢补齐真实作品案例、关于页叙事和相册内容。
              </p>
            </div>

            <div className="rounded-[1.35rem] border border-border bg-white/35 p-4 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm text-accent-strong">
                <Wrench className="h-4 w-4" />
                技术侧关键词
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {creatorKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-border/80 bg-white/60 px-3 py-1.5 text-xs text-foreground/80 dark:bg-white/6"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-border bg-white/35 p-4 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm text-accent-strong">
                <Clock3 className="h-4 w-4" />
                近期状态
              </div>
              <p className="mt-2 text-sm leading-7 text-muted">
                首页结构已经稳定，主题切换、阅读体验和移动端细节还在持续收紧，内容也在慢慢补充进来。
              </p>
            </div>

            <div className="rounded-[1.35rem] border border-border bg-white/35 p-4 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm text-accent-strong">
                <Flag className="h-4 w-4" />
                下一步计划
              </div>
              <ul className="mt-2 grid gap-2 text-sm leading-7 text-muted">
                {nextSteps.map((step) => (
                  <li key={step} className="flex gap-2">
                    <span className="mt-[0.72rem] h-1.5 w-1.5 rounded-full bg-accent/70" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.45rem] border border-border bg-white/45 p-4 dark:bg-white/6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">GitHub 贡献热力图</p>
                  <p className="mt-1 text-xs text-muted">@{githubUsername}</p>
                </div>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-accent-strong hover:text-accent"
                >
                  查看 GitHub
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="mt-4 overflow-hidden rounded-[1.1rem] border border-border/80 bg-white p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]">
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

      <HomeScrollReveal className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]" delay={160}>
        <div className="site-grid">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker text-sm font-semibold">Friends</p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                也想把喜欢的个人站点放进来
              </h2>
            </div>
            <Link href="/friends" className="inline-flex items-center gap-2 text-sm text-accent-strong hover:text-accent">
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
            <div className="flex items-center gap-3 text-accent-strong">
              <Handshake className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium text-foreground">加入友链</p>
                <p className="mt-1 text-xs text-muted">如果你的小站也在认真生长，欢迎来交换。</p>
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-border bg-white/35 p-4 dark:bg-white/5">
              <p className="text-sm font-medium text-accent-strong">交换方式</p>
              <ol className="mt-3 grid gap-3 text-sm leading-7 text-muted">
                <li>先把本站加入你的友链页，或准备好交换意向。</li>
                <li>把站点名、链接、简介、头像和 `RSS`（可选）发给我。</li>
                <li>通过邮箱或 GitHub 联系，我会尽快回看并补上。</li>
              </ol>
            </div>

            <div className="rounded-[1.4rem] border border-border bg-white/35 p-4 dark:bg-white/5">
              <p className="text-sm font-medium text-accent-strong">小型推荐语</p>
              <p className="mt-2 text-sm leading-7 text-muted">
                我更偏爱有作者气味、长期更新的独立小站。技术、设计、摄影、写作都欢迎，比起“信息堆叠”，我更喜欢能看见个人表达的页面。
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {linkTopics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-border/80 bg-white/55 px-3 py-1.5 text-xs text-foreground/82 dark:bg-white/6"
                >
                  {topic}
                </span>
              ))}
            </div>

            <div className="grid gap-3">
              <a
                href={`mailto:${siteConfig.author.email}?subject=${encodeURIComponent("友链交换 / 木杉的风与代码")}`}
                className="inline-flex items-center justify-between rounded-[1.1rem] border border-border bg-white/45 px-4 py-3 text-sm text-foreground hover:border-accent/20 hover:text-accent-strong dark:bg-white/5"
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
                className="inline-flex items-center justify-between rounded-[1.1rem] border border-border bg-white/45 px-4 py-3 text-sm text-foreground hover:border-accent/20 hover:text-accent-strong dark:bg-white/5"
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
