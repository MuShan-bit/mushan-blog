import { profile } from "@/data/profile";

const githubUsernamePattern = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

function getDefaultGithubUsername() {
  return profile.github.replace(/^https?:\/\/github\.com\//i, "").replace(/\/$/, "");
}

function buildFallbackSvg(username: string) {
  const safeUsername = username.replace(/[<>&"]/g, "");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 160" role="img" aria-label="GitHub 贡献热力图暂不可用">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#f8fbf9" />
          <stop offset="100%" stop-color="#eef4f0" />
        </linearGradient>
      </defs>
      <rect width="720" height="160" rx="24" fill="url(#bg)" />
      <g fill="#d7e6dc">
        <rect x="36" y="34" width="12" height="12" rx="3" />
        <rect x="54" y="34" width="12" height="12" rx="3" />
        <rect x="72" y="34" width="12" height="12" rx="3" />
        <rect x="90" y="34" width="12" height="12" rx="3" />
        <rect x="108" y="34" width="12" height="12" rx="3" />
        <rect x="126" y="34" width="12" height="12" rx="3" />
        <rect x="144" y="34" width="12" height="12" rx="3" />
        <rect x="36" y="52" width="12" height="12" rx="3" />
        <rect x="54" y="52" width="12" height="12" rx="3" />
        <rect x="72" y="52" width="12" height="12" rx="3" />
        <rect x="90" y="52" width="12" height="12" rx="3" />
        <rect x="108" y="52" width="12" height="12" rx="3" />
        <rect x="126" y="52" width="12" height="12" rx="3" />
        <rect x="144" y="52" width="12" height="12" rx="3" />
      </g>
      <text x="190" y="64" fill="#244537" font-family="ui-sans-serif, system-ui, sans-serif" font-size="20" font-weight="600">
        GitHub 贡献热力图暂时不可用
      </text>
      <text x="190" y="96" fill="#587364" font-family="ui-sans-serif, system-ui, sans-serif" font-size="15">
        稍后可以直接访问 github.com/${safeUsername} 查看完整贡献记录。
      </text>
    </svg>
  `.trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedUsername = searchParams.get("user")?.trim() ?? "";
  const username = githubUsernamePattern.test(requestedUsername)
    ? requestedUsername
    : getDefaultGithubUsername();
  const upstreamUrl = `https://ghchart.rshah.org/${encodeURIComponent(username)}`;

  try {
    const response = await fetch(upstreamUrl, {
      headers: {
        Accept: "image/svg+xml",
      },
      next: {
        revalidate: 60 * 60 * 12,
      },
    });

    if (!response.ok) {
      throw new Error(`Upstream heatmap request failed with status ${response.status}`);
    }

    const svg = await response.text();

    return new Response(svg, {
      headers: {
        "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=604800",
        "Content-Type": "image/svg+xml; charset=utf-8",
      },
    });
  } catch (error) {
    console.warn("Unable to fetch GitHub heatmap.", error);

    return new Response(buildFallbackSvg(username), {
      headers: {
        "Cache-Control": "public, max-age=1800",
        "Content-Type": "image/svg+xml; charset=utf-8",
      },
    });
  }
}
