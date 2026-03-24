import type { FriendLink } from "@/lib/types";

export const friends: FriendLink[] = [
  {
    name: "山雾实验室",
    url: "https://shanwu.example.com",
    avatar: "/art/friend-shanwu.svg",
    description: "记录独立开发、设计实验与城市声音采样的小站。",
    tags: ["独立开发", "设计", "博客"],
    rss: "https://shanwu.example.com/rss.xml",
    featured: true,
  },
  {
    name: "晴川记事",
    url: "https://qingchuan.example.com",
    avatar: "/art/friend-qingchuan.svg",
    description: "偏产品与文字写作的个人博客，内容很温柔。",
    tags: ["产品", "随笔"],
    featured: true,
  },
  {
    name: "Byte & Bloom",
    url: "https://bytebloom.example.com",
    avatar: "/art/friend-bytebloom.svg",
    description: "把前端工程、视觉系统和动效研究放在一起整理的园地。",
    tags: ["前端", "动效", "工程"],
    rss: "https://bytebloom.example.com/feed.xml",
  },
  {
    name: "橘子海相册",
    url: "https://orange-sea.example.com",
    avatar: "/art/friend-orange.svg",
    description: "以胶片摄影和海边旅行照片为主的视觉站点。",
    tags: ["摄影", "相册"],
  },
  {
    name: "夜航路标",
    url: "https://yehang.example.com",
    avatar: "/art/friend-night.svg",
    description: "关注开源工具、个人效率与长期主义写作。",
    tags: ["开源", "效率", "写作"],
  },
];
