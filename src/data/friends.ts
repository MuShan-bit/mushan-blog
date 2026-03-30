import type { FriendLink } from "@/lib/types";
import { resolveOssAssetUrl } from "@/lib/assets";

export const friends: FriendLink[] = [
  {
    name: "Orion Chen's Blog",
    url: "https://www.orionchen.me",
    avatar: "/art/friend-link/orion-chen.jpg",
    description: "终端风博客，记录技术、生活、思考",
    tags: ["前端", "面经", "思考", "网络", "AI"],
    featured: true,
  },
  {
    name: "txuw🌺星空笔记",
    url: "https://blog.txuw.top/",
    avatar: resolveOssAssetUrl("friend-link/txuw.svg"),
    description: "记录独立开发、运维实战，服务器组网",
    tags: ["独立", "设计模式", "服务器", "游戏"],
    rss: "https://blog.txuw.top/rss.xml",
    featured: true,
  },
  {
    name: "Obsidianlyg's Blog",
    url: "https://www.obsidianlyg.top/",
    avatar: "/art/friend-link/obsidianlyg.png",
    description: "技术分享和AI实践",
    tags: ["技术分享", "AI", "后端开发", "工具分享"],
  },
  {
    name: "Haog's Blog",
    url: "https://2768085634.github.io/",
    avatar: "/art/friend-link/haog.png",
    description: "二次元风格的技术分享博客",
    tags: ["算法", "后端开发", "Python", "爬虫"],
    featured: true,
  },
];
