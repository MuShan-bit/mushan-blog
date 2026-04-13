const defaultSiteUrl = "https://mushan.blog";

function resolveSiteUrl(rawValue: string | undefined) {
  const value = rawValue?.trim();

  if (!value) {
    return defaultSiteUrl;
  }

  const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    return new URL(normalized).toString().replace(/\/$/, "");
  } catch {
    return defaultSiteUrl;
  }
}

export const siteConfig = {
  name: "木杉",
  title: "木杉的风与代码",
  description: "记录代码、设计、影像与作品，也把生活的纹理留在页面里。",
  siteUrl: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  nav: [
    { href: "/blog", label: "文章" },
    { href: "/series", label: "专题" },
    { href: "/portfolio", label: "作品集" },
    { href: "/gallery", label: "相册" },
    { href: "/friends", label: "友链" },
    { href: "/about", label: "关于木杉" },
  ],
  author: {
    name: "木杉",
    email: "mushanfu0@gmail.com",
  },
};
