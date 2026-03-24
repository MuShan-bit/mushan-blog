export const siteConfig = {
  name: "木杉",
  title: "木杉的风与代码",
  description: "记录代码、设计、影像与作品，也把生活的纹理留在页面里。",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mushan.blog").replace(/\/$/, ""),
  nav: [
    { href: "/blog", label: "文章" },
    { href: "/portfolio", label: "作品集" },
    { href: "/gallery", label: "相册" },
    { href: "/friends", label: "友联" },
    { href: "/about", label: "关于木杉" },
  ],
  author: {
    name: "木杉",
    email: "hello@mushan.dev",
  },
};
