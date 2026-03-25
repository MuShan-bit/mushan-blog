import Link from "next/link";
import { ArrowDown, ArrowRight, Github, Sparkles } from "lucide-react";
import { profile } from "@/data/profile";
import { siteConfig } from "@/lib/site";

type HomeHeroProps = {
  postCount: number;
  portfolioCount: number;
  albumCount: number;
};

const homeModules = [
  { href: "/blog", label: "文章" },
  { href: "/portfolio", label: "作品集" },
  { href: "/gallery", label: "相册" },
  { href: "/friends", label: "友联" },
];

export function HomeHero({ postCount, portfolioCount, albumCount }: HomeHeroProps) {
  return (
    <section className="home-hero">
      <div className="home-hero__backtype">Mushan</div>

      <div className="relative mx-auto flex min-h-[inherit] w-full max-w-7xl flex-col justify-between gap-10 px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(19rem,0.82fr)] lg:gap-12">
          <div className="flex min-h-[22rem] flex-col justify-center">
            <p className="section-kicker text-sm font-semibold">Mushan Personal Blog</p>

            <div className="mt-5 space-y-6">
              <div className="space-y-4">
                <p className="text-sm font-medium tracking-[0.02em] text-accent-strong">{profile.headline}</p>
                <h1 className="font-display max-w-5xl text-5xl font-semibold tracking-[-0.065em] text-foreground sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
                  {siteConfig.title}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">{siteConfig.description}</p>
                <p className="max-w-3xl text-sm leading-8 text-muted sm:text-base">{profile.intro}</p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {profile.skills.slice(0, 6).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-border/80 bg-white/50 px-3.5 py-2 text-xs font-medium text-foreground/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.26)] dark:bg-white/8"
                  >
                    {skill}
                  </span>
                ))}
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
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white/50 px-5 py-3 text-sm font-medium text-foreground hover:-translate-y-0.5 hover:border-accent/24 hover:text-accent-strong dark:bg-white/8"
                >
                  关于木杉
                </Link>
              </div>
            </div>
          </div>

          <div className="home-hero__rail">
            <div className="home-hero__panel">
              <div className="flex items-center gap-3 text-accent-strong">
                <Sparkles className="h-5 w-5" />
                <p className="text-sm font-medium">个人叙事 / 当前气味</p>
              </div>
              <p className="mt-5 font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">
                {profile.motto}
              </p>
              <p className="mt-4 text-sm leading-7 text-muted">{profile.headline}</p>
              <Link
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm text-accent-strong hover:text-accent"
              >
                <Github className="h-4 w-4" />
                GitHub / mushan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="home-hero__panel home-hero__panel--muted">
              <p className="text-sm font-medium text-accent-strong">内容优先的入口结构</p>
              <p className="mt-3 text-sm leading-7 text-muted">
                首屏先建立“木杉”的识别和气质，向下滚动后再把文章、作品、相册和友联依次铺开，不让信息堆叠打断情绪。
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {homeModules.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-border/80 bg-white/44 px-3 py-1.5 text-xs font-medium text-foreground/78 hover:border-accent/24 hover:text-accent-strong dark:bg-white/8"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-4 sm:grid-cols-3 xl:flex-1">
            <div className="home-hero__metric">
              <p className="text-sm text-muted">已收录文章</p>
              <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-foreground">{postCount}</p>
            </div>
            <div className="home-hero__metric">
              <p className="text-sm text-muted">作品案例</p>
              <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-foreground">{portfolioCount}</p>
            </div>
            <div className="home-hero__metric">
              <p className="text-sm text-muted">相册主题</p>
              <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-foreground">{albumCount}</p>
            </div>
          </div>

          <a href="#home-flow" className="home-scroll-cue">
            <span className="home-scroll-cue__icon">
              <ArrowDown className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-accent-strong">
                Scroll Reveal
              </span>
              <span className="mt-1 block text-sm text-foreground">下拉展开内容</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
