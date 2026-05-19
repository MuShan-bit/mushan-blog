export const siteSearchOpenEvent = "mushan:site-search-open";

export type SiteSearchOpenDetail = {
  query?: string;
};

export function openSiteSearch(detail?: SiteSearchOpenDetail) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<SiteSearchOpenDetail>(siteSearchOpenEvent, {
      detail,
    }),
  );
}
