import type { ProfileConfig } from "@/lib/types";

export const profile: ProfileConfig = {
  name: "木杉",
  headline: "独立开发者 / 设计驱动的前端工程师",
  intro:
    "我喜欢把代码写成有温度的界面，也喜欢把生活里的风景、节奏和细小情绪慢慢存进页面。这个站点会记录我的技术实践、产品观察、摄影片段和正在生长中的作品。",
  skills: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Tailwind CSS",
    "Motion Design",
    "SEO",
    "MDX 内容系统",
    "Supabase",
    "Three.js",
  ],
  hobbies: ["街角摄影", "步行采样", "咖啡店写作", "UI 观察", "慢节奏旅行"],
  contacts: [
    {
      label: "邮箱",
      value: "hello@mushan.dev",
      href: "mailto:hello@mushan.dev",
      type: "email",
    },
    {
      label: "GitHub",
      value: "github.com/mushan",
      href: "https://github.com/mushan",
      type: "github",
    },
    {
      label: "所在地",
      value: "Shanghai / Remote",
      href: "https://maps.google.com/?q=Shanghai",
      type: "location",
    },
  ],
  github: "https://github.com/mushan",
  motto: "把理性结构写稳，再给它一点呼吸感。",
  portraitAsset: "/portrait/mushan-silhouette.svg",
  aboutKeywords: [
    "木杉",
    "MUSHAN",
    "design",
    "code",
    "静态博客",
    "摄影",
    "portfolio",
    "calm",
    "craft",
    "SEO",
    "MDX",
    "motion",
    "Three.js",
    "front-end",
  ],
  journey: [
    {
      title: "从界面细节开始",
      description: "先学会观察阅读节奏、留白和交互反馈，再把这些感觉翻译成代码结构。",
    },
    {
      title: "把内容做成长期空间",
      description: "不只做一次性的作品页，而是搭建一个能慢慢积累文章、项目与生活记录的个人站点。",
    },
    {
      title: "让技术和表达同频",
      description: "希望每个页面既有性能、SEO 和工程质量，也有一点让人记住的气味与质感。",
    },
  ],
};
