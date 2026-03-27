import { PageIntro } from "@/components/content/page-intro";
import { FriendCard } from "@/components/content/friend-card";
import { JsonLd } from "@/components/seo/json-ld";
import { friends } from "@/data/friends";
import { createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "友链",
  description: "木杉收藏与推荐的个人站点、博客与摄影页面。",
  path: "/friends",
  keywords: ["友链", "友情链接", "独立博客", "个人站"],
});

export default function FriendsPage() {
  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "友链", path: "/friends" },
        ])}
      />

      <PageIntro
        eyebrow="Friends"
        title="开往下一站的列车，从这里开始"
        description="愿你在旅途中，邂逅不同的风景，聆听各异的故事。我在等风起，也在等你归来。"
      />

      <section className="grid gap-4">
        {friends.map((friend) => (
          <FriendCard key={friend.name} friend={friend} />
        ))}
      </section>
    </>
  );
}
