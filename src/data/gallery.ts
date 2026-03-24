import type { GalleryAlbum } from "@/lib/types";

export const galleryAlbums: GalleryAlbum[] = [
  {
    title: "潮汐通勤",
    slug: "commute-tides",
    description: "把地铁口、玻璃反射和下班时的风都收集起来，像一组轻微起伏的潮汐。",
    cover: "/gallery/commute-cover.svg",
    theme: "城市缝隙",
    photos: [
      {
        src: "/gallery/commute-01.svg",
        alt: "落日映在电车玻璃上的抽象画面",
        caption: "晚高峰被日落切出一条暖色边缘。",
        width: 1200,
        height: 1500,
        takenAt: "2026-02-13",
      },
      {
        src: "/gallery/commute-02.svg",
        alt: "薄荷绿调的街角通勤场景",
        caption: "风经过路口时，人的移动速度会突然慢下来。",
        width: 1200,
        height: 960,
      },
      {
        src: "/gallery/commute-03.svg",
        alt: "玻璃幕墙与电线交错的图形画面",
        caption: "城市里最喜欢的，是被反射打乱后的秩序。",
        width: 1200,
        height: 1320,
      },
    ],
  },
  {
    title: "街角植物志",
    slug: "green-corners",
    description: "不是去公园拍花，而是在路上和楼下，记录那些突然冒出来的绿色。",
    cover: "/gallery/green-cover.svg",
    theme: "日常植物",
    photos: [
      {
        src: "/gallery/green-01.svg",
        alt: "窗口边一盆被光照亮的植物",
        caption: "午后两点的阳光像给叶片加了一层柔焦。",
        width: 1200,
        height: 1400,
      },
      {
        src: "/gallery/green-02.svg",
        alt: "藤蔓沿着墙面向上生长的画面",
        caption: "城市表面也会长出很轻的生命纹理。",
        width: 1200,
        height: 900,
      },
      {
        src: "/gallery/green-03.svg",
        alt: "带有露水感的浅绿植物特写",
        caption: "这种颜色适合拿来做整个站点的呼吸感。",
        width: 1200,
        height: 1500,
      },
    ],
  },
  {
    title: "夜里有蓝色",
    slug: "night-blue-notes",
    description: "把路灯、雨后路面和屏幕微光都拍得轻一点，让夜晚保留安静的层次。",
    cover: "/gallery/night-cover.svg",
    theme: "低照度记录",
    photos: [
      {
        src: "/gallery/night-01.svg",
        alt: "雨后路面反光与灯带形成的蓝色夜景",
        caption: "夜色最迷人的时候，总会带一点潮湿。",
        width: 1200,
        height: 900,
      },
      {
        src: "/gallery/night-02.svg",
        alt: "蓝色调玻璃和建筑轮廓组成的夜间画面",
        caption: "玻璃上的微光像是另一座更慢的城市。",
        width: 1200,
        height: 1450,
      },
      {
        src: "/gallery/night-03.svg",
        alt: "昏暗环境中带有灯光颗粒的抽象场景",
        caption: "想把这种安静感做进关于页的视差里。",
        width: 1200,
        height: 1380,
      },
    ],
  },
];

export function getGalleryAlbumBySlug(slug: string) {
  return galleryAlbums.find((album) => album.slug === slug) ?? null;
}
