import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { HomeThemeDots } from "@/components/home/home-theme-dots";
import { profile } from "@/data/profile";
import { siteConfig } from "@/lib/site";

type HomeHeroProps = {
  postCount: number;
  portfolioCount: number;
  albumCount: number;
};

export function HomeHero({ postCount, portfolioCount, albumCount }: HomeHeroProps) {
  return (
    <section className="home-hero">
      <div className="relative mx-auto flex min-h-[inherit] w-full max-w-7xl flex-col justify-between gap-10 px-6 py-8 sm:px-8 sm:py-10 xl:px-12 xl:py-12">
        <div className="flex flex-1 items-center">
          <div className="grid w-full gap-10 xl:grid-cols-[minmax(0,1.18fr)_minmax(19rem,0.82fr)] xl:gap-12">
            <div className="flex min-h-[22rem] flex-col justify-center xl:pt-6">
              <div className="home-hero__headline-wrap">
                <div className="home-hero__backtype">𝓜𝓾𝓢𝓱𝓪𝓷</div>
                <div className="relative z-10 space-y-4">
                  <p className="section-kicker text-sm font-semibold">Mushan Personal Blog</p>
                  <p className="text-sm font-medium tracking-[0.02em] text-accent-strong">{profile.headline}</p>
                  <h1 className="font-display max-w-5xl text-5xl font-semibold tracking-[-0.065em] text-foreground sm:text-6xl xl:text-7xl 2xl:text-[5.4rem]">
                    {siteConfig.title}
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">{siteConfig.description}</p>
                  <p className="max-w-3xl text-sm leading-8 text-muted sm:text-base">{profile.intro}</p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
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

                <HomeThemeDots />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="hidden gap-4 xl:grid xl:grid-cols-3 xl:flex-1">
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
