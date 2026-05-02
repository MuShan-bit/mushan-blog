const defaultSiteUrl = "https://blog.mushan.space";

/**
 * @param {string | undefined} rawValue
 */
function normalizeUrl(rawValue) {
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

/**
 * @param {string | undefined} rawValue
 * @param {string} fallback
 */
function resolveSiteUrl(rawValue, fallback = defaultSiteUrl) {
  return normalizeUrl(rawValue) ?? normalizeUrl(fallback) ?? defaultSiteUrl;
}

/**
 * @param {string | undefined} rawValue
 */
function resolveDeployRegion(rawValue) {
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

/**
 * @param {string} currentSiteUrl
 * @param {string} cnSiteUrl
 * @param {string} globalSiteUrl
 */
function inferDeployRegion(currentSiteUrl, cnSiteUrl, globalSiteUrl) {
  if (currentSiteUrl === cnSiteUrl) {
    return "cn";
  }

  if (currentSiteUrl === globalSiteUrl) {
    return "global";
  }

  return /(^https?:\/\/[^/]*\.cn(?=[:/]|$))/i.test(currentSiteUrl) ? "cn" : "global";
}

const configuredSiteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, defaultSiteUrl);
const cnSiteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_CN_SITE_URL, configuredSiteUrl);
const globalSiteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_GLOBAL_SITE_URL, configuredSiteUrl);
const configuredDeployRegion = resolveDeployRegion(process.env.NEXT_PUBLIC_DEPLOY_REGION);
const deployRegion =
  configuredDeployRegion ?? inferDeployRegion(configuredSiteUrl, cnSiteUrl, globalSiteUrl);
const activeSiteUrl = deployRegion === "cn" ? cnSiteUrl : globalSiteUrl;

/** @type {import("next-sitemap").IConfig} */
const config = {
  siteUrl: activeSiteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  autoLastmod: true,
  outDir: "public",
  exclude: ["/api/*", "/apple-icon.png", "/icon.png"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    additionalSitemaps: [`${activeSiteUrl}/sitemap.xml`],
  },
};

export default config;
