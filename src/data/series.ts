import type { SeriesDefinition } from "@/lib/types";

export const seriesDefinitions: SeriesDefinition[] = [
  {
    title: "博客构建手记",
    slug: "blog-building-journal",
    summary: "把这次个人博客从视觉、内容系统到阅读体验的搭建过程串成一组可以顺着读下去的文章。",
    description:
      "这是一个围绕博客重构展开的专题。它不只记录页面长什么样，也把内容建模、组件拆分、代码块体验这些细节串了起来。按顺序读下来，会更容易看到这座站点是怎么一步步长出来的。",
    cover: "/art/post-breathing-blog.svg",
    featured: true,
    seoTitle: "博客构建手记专题",
    seoDescription: "从视觉方向、MDX 内容系统到代码块体验，按顺序阅读木杉的博客构建过程。",
    postSlugs: [
      "designing-a-blog-that-breathes",
      "building-content-with-mdx-and-zod",
      "code-block-showcase",
    ],
  },
];
