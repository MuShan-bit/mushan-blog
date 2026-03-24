import Link from "next/link";
import { ArrowRight, BookOpenText, Camera, LayoutPanelLeft, Sparkles } from "lucide-react";
import { AlbumCard } from "@/components/content/album-card";
import { FriendCard } from "@/components/content/friend-card";
import { PortfolioCard } from "@/components/content/portfolio-card";
import { PostCard } from "@/components/content/post-card";
import { JsonLd } from "@/components/seo/json-ld";
import { friends } from "@/data/friends";
import { galleryAlbums } from "@/data/gallery";
import { profile } from "@/data/profile";
import { getFeaturedPortfolioEntries, getFeaturedPosts, getPublishedPosts } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = createPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
  keywords: ["木杉", "Next.js 博客", "个人博客", "作品集", "相册", "RSS"],
});

export default async function Home() {
  const [allPosts, featuredPosts, featuredPortfolioEntries] = await Promise.all([
    getPublishedPosts(),
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

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="glass-panel relative overflow-hidden rounded-[2.4rem] p-7 sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(120,221,178,0.22),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(114,198,255,0.18),transparent_24%)]" />
          <div className="relative space-y-8">
            <div className="space-y-4">
              <p className="section-kicker text-sm font-semibold">Mushan Personal Blog</p>
              <h1 className="font-display max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-6xl lg:text-7xl">
                木杉的风与代码
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                一个以中文写作为主的个人静态博客，收纳文章、作品、相册与友联，也保留一点轻盈的玻璃质感和液态动效。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="liquid-button inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white hover:-translate-y-0.5 hover:bg-accent-strong"
              >
                进入文章
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/45 px-5 py-3 text-sm font-medium text-foreground hover:-translate-y-0.5 hover:border-accent/20 hover:text-accent-strong dark:bg-white/5"
              >
                关于木杉
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.6rem] border border-border bg-white/45 p-5 dark:bg-white/5">
                <p className="text-sm text-muted">已收录文章</p>
                <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.05em] text-foreground">
                  {allPosts.length}
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-border bg-white/45 p-5 dark:bg-white/5">
                <p className="text-sm text-muted">精选作品</p>
                <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.05em] text-foreground">
                  {featuredPortfolioEntries.length}
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-border bg-white/45 p-5 dark:bg-white/5">
                <p className="text-sm text-muted">相册主题</p>
                <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.05em] text-foreground">
                  {galleryAlbums.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="glass-panel rounded-[2.2rem] p-7">
            <div className="flex items-center gap-3 text-accent-strong">
              <Sparkles className="h-5 w-5" />
              <p className="text-sm font-medium">内容优先的入口结构</p>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">
              首页先建立个人识别，再把文章、作品、相册和友联作为连续展开的栏目。阅读和浏览都尽量干净，不让结构打断情绪。
            </p>
          </div>
          <div className="glass-panel rounded-[2.2rem] p-7">
            <p className="font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">
              {profile.motto}
            </p>
            <p className="mt-4 text-sm leading-7 text-muted">{profile.intro}</p>
            <Link
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-accent-strong hover:text-accent"
            >
              GitHub / mushan
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="site-grid">
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
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
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
      </section>

      <section className="site-grid">
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
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
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
      </section>
    </>
  );
}
