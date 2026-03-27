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
                  <p className="text-accent-strong text-sm font-medium tracking-[0.02em]">
                    {profile.headline}
                  </p>
                  <h1 className="font-display text-foreground max-w-5xl text-5xl font-semibold tracking-[-0.065em] sm:text-6xl xl:text-7xl 2xl:text-[5.4rem]">
                    {siteConfig.title}
                  </h1>
                  <p className="text-muted max-w-2xl text-base leading-8 sm:text-lg">
                    {siteConfig.description}
                  </p>
                  <p className="text-muted max-w-3xl text-sm leading-8 sm:text-base">
                    {profile.intro}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="flex flex-wrap gap-2.5">
                  {profile.skills.slice(0, 6).map((skill) => (
                    <span
                      key={skill}
                      className="border-border/80 text-foreground/78 rounded-full border bg-white/50 px-3.5 py-2 text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.26)] dark:bg-white/8"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/blog"
                    className="liquid-button bg-accent hover:bg-accent-strong inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white hover:-translate-y-0.5"
                  >
                    进入文章
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/about"
                    className="border-border text-foreground hover:border-accent/24 hover:text-accent-strong inline-flex items-center gap-2 rounded-full border bg-white/50 px-5 py-3 text-sm font-medium hover:-translate-y-0.5 dark:bg-white/8"
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
          <div className="hidden gap-4 xl:grid xl:flex-1 xl:grid-cols-3">
            <div className="home-hero__metric">
              <p className="text-muted text-sm">已收录文章</p>
              <p className="font-display text-foreground mt-3 text-4xl font-semibold tracking-[-0.05em]">
                {postCount}
              </p>
            </div>
            <div className="home-hero__metric">
              <p className="text-muted text-sm">作品案例</p>
              <p className="font-display text-foreground mt-3 text-4xl font-semibold tracking-[-0.05em]">
                {portfolioCount}
              </p>
            </div>
            <div className="home-hero__metric">
              <p className="text-muted text-sm">相册主题</p>
              <p className="font-display text-foreground mt-3 text-4xl font-semibold tracking-[-0.05em]">
                {albumCount}
              </p>
            </div>
          </div>

          <a href="#home-flow" className="home-scroll-cue">
            <span className="home-scroll-cue__icon">
              <ArrowDown className="h-4 w-4" />
            </span>
            <span>
              <span className="text-accent-strong block text-[0.7rem] font-semibold tracking-[0.28em] uppercase">
                Scroll Reveal
              </span>
              <span className="text-foreground mt-1 block text-sm">下拉展开内容</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
