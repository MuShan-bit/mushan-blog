const absoluteUrlPattern = /^(?:https?:)?\/\//i;

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function ensureLeadingSlash(value: string) {
  return value.startsWith("/") ? value : `/${value}`;
}

export const ossBaseUrl = trimTrailingSlash(
  process.env.NEXT_PUBLIC_OSS_BASE_URL ?? "https://image-blog-mushan.oss-cn-beijing.aliyuncs.com",
);

export function resolveOssAssetUrl(path: string) {
  if (!path) {
    return path;
  }

  if (absoluteUrlPattern.test(path)) {
    return path;
  }

  const normalizedPath = ensureLeadingSlash(path);

  return `${ossBaseUrl}${normalizedPath}`;
}
