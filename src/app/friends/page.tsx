import { PageIntro } from "@/components/content/page-intro";
import { FriendCard } from "@/components/content/friend-card";
import { JsonLd } from "@/components/seo/json-ld";
import { friends } from "@/data/friends";
import { createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "友联",
  description: "木杉收藏与推荐的个人站点、博客与摄影页面。",
  path: "/friends",
  keywords: ["友联", "友情链接", "独立博客", "个人站"],
});

export default function FriendsPage() {
  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "友联", path: "/friends" },
        ])}
      />

      <PageIntro
        eyebrow="Friends"
        title="喜欢的个人站点，也该有一个安静位置"
        description="先以手动维护的精选列表开始，把那些同样认真经营内容、设计或摄影的朋友站点收纳进来。"
      />

      <section className="grid gap-4">
        {friends.map((friend) => (
          <FriendCard key={friend.name} friend={friend} />
        ))}
      </section>
    </>
  );
}
