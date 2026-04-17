const defaultSiteUrl = "https://mushan.blog";
const icpRecordNumber = "黑ICP备2026003557号-1";

type DeployRegion = "cn" | "global";

function normalizeUrl(rawValue: string | undefined) {
  const value = rawValue?.trim();

  if (!value) {
    return null;
  }

  const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    return new URL(normalized).toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function resolveSiteUrl(rawValue: string | undefined, fallback: string = defaultSiteUrl) {
  return normalizeUrl(rawValue) ?? normalizeUrl(fallback) ?? defaultSiteUrl;
}

function resolveDeployRegion(rawValue: string | undefined) {
  const value = rawValue?.trim().toLowerCase();

  if (!value) {
    return null;
  }

  if (["cn", "china", "domestic", "mainland"].includes(value)) {
    return "cn";
  }

  if (["global", "overseas", "intl", "international", "foreign"].includes(value)) {
    return "global";
  }

  return null;
}

function inferDeployRegion(currentSiteUrl: string, cnSiteUrl: string, globalSiteUrl: string): DeployRegion {
  if (currentSiteUrl === cnSiteUrl) {
    return "cn";
  }

  if (currentSiteUrl === globalSiteUrl) {
    return "global";
  }

  return /(^https?:\/\/[^/]*\.cn(?=[:/]|$))/i.test(currentSiteUrl) ? "cn" : "global";
}

const configuredSiteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
const cnSiteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_CN_SITE_URL, configuredSiteUrl);
const globalSiteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_GLOBAL_SITE_URL, configuredSiteUrl);
const configuredDeployRegion = resolveDeployRegion(process.env.NEXT_PUBLIC_DEPLOY_REGION);
const deployRegion =
  configuredDeployRegion ?? inferDeployRegion(configuredSiteUrl, cnSiteUrl, globalSiteUrl);
const activeSiteUrl = deployRegion === "cn" ? cnSiteUrl : globalSiteUrl;
const accelerateSiteUrl = deployRegion === "cn" ? globalSiteUrl : cnSiteUrl;
const accelerateSiteLabel = deployRegion === "cn" ? "跳转至国外加速" : "跳转至国内加速";
const showAccelerateLink = accelerateSiteUrl !== activeSiteUrl;

export const siteConfig = {
  name: "木杉",
  title: "木杉的风与代码",
  description: "记录代码、设计、影像与作品，也把生活的纹理留在页面里。",
  siteUrl: activeSiteUrl,
  cnSiteUrl,
  globalSiteUrl,
  deployRegion,
  accelerateSiteUrl: showAccelerateLink ? accelerateSiteUrl : null,
  accelerateSiteLabel,
  icpRecordNumber,
  showIcpRecord: deployRegion === "cn",
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
