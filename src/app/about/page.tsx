import Link from "next/link";
import { Github, Mail, MapPin } from "lucide-react";
import { AboutScene } from "@/components/about/about-scene";
import { PageIntro } from "@/components/content/page-intro";
import { JsonLd } from "@/components/seo/json-ld";
import { profile } from "@/data/profile";
import { createBreadcrumbJsonLd, createPageMetadata, createPersonJsonLd } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "关于木杉",
  description: "关于木杉的个人展示页，包含技能、爱好、联系方式、GitHub 与 3D 文本形象。",
  path: "/about",
  keywords: [...profile.skills, ...profile.hobbies],
});

const iconMap = {
  email: Mail,
  github: Github,
  social: Github,
  location: MapPin,
} as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd data={createPersonJsonLd(profile)} />
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "关于木杉", path: "/about" },
        ])}
      />

      <PageIntro
        eyebrow="About Mushan"
        title="关于木杉"
        description="这页不只是常规的个人资料页，我更想把“我是谁、我在意什么、我如何把感觉做成界面”一起放进来。"
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <AboutScene keywords={profile.aboutKeywords} />

        <div className="grid gap-6">
          <div className="glass-panel rounded-[2rem] p-7">
            <h2 className="font-display text-foreground text-3xl font-semibold tracking-[-0.05em]">
              {profile.headline}
            </h2>
            <p className="text-muted mt-4 text-base leading-8">{profile.intro}</p>
            <p className="border-border text-accent-strong mt-5 rounded-[1.4rem] border bg-white/35 px-4 py-3 text-sm dark:bg-white/5">
              {profile.motto}
            </p>
          </div>

          <div className="glass-panel rounded-[2rem] p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-foreground text-2xl font-semibold tracking-[-0.04em]">
                联系方式
              </h2>
              <Link
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="text-accent-strong text-sm"
              >
                GitHub
              </Link>
            </div>
            <div className="mt-5 grid gap-3">
              {profile.contacts.map((contact) => {
                const Icon = iconMap[contact.type];

                return (
                  <Link
                    key={contact.label}
                    href={contact.href}
                    target={contact.href.startsWith("http") ? "_blank" : undefined}
                    rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
                    className="border-border hover:border-accent/20 hover:text-accent-strong flex items-center justify-between rounded-[1.2rem] border bg-white/35 px-4 py-3 text-sm dark:bg-white/5"
                  >
                    <span className="inline-flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {contact.label}
                    </span>
                    <span className="text-muted">{contact.value}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-[2rem] p-7">
          <h2 className="font-display text-foreground text-3xl font-semibold tracking-[-0.05em]">
            技能
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="border-border bg-accent-soft text-accent-strong rounded-full border px-4 py-2 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-7">
          <h2 className="font-display text-foreground text-3xl font-semibold tracking-[-0.05em]">
            爱好
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {profile.hobbies.map((hobby) => (
              <span
                key={hobby}
                className="border-border text-muted rounded-full border bg-white/35 px-4 py-2 text-sm dark:bg-white/5"
              >
                {hobby}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] p-7">
        <h2 className="font-display text-foreground text-3xl font-semibold tracking-[-0.05em]">
          我的路径
        </h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {profile.journey.map((item) => (
            <div
              key={item.title}
              className="border-border rounded-[1.6rem] border bg-white/35 p-5 dark:bg-white/5"
            >
              <p className="font-display text-foreground text-2xl font-semibold tracking-[-0.04em]">
                {item.title}
              </p>
              <p className="text-muted mt-3 text-sm leading-7">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
