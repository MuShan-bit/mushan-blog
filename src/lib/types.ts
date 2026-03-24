export type Post = {
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  cover: string;
  draft: boolean;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  content: string;
  readingTime: {
    text: string;
    minutes: number;
    words: number;
  };
};

export type TermSummary = {
  label: string;
  slug: string;
  count: number;
};

export type PortfolioLink = {
  label: string;
  url: string;
  type: "case" | "repo" | "demo" | "note";
};

export type PortfolioEntry = {
  title: string;
  slug: string;
  summary: string;
  period: string;
  role: string;
  stack: string[];
  cover: string;
  links: PortfolioLink[];
  featured: boolean;
  status: "planned" | "active" | "archived";
  content: string;
};

export type GalleryPhoto = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  takenAt?: string;
};

export type GalleryAlbum = {
  title: string;
  slug: string;
  description: string;
  cover: string;
  theme: string;
  photos: GalleryPhoto[];
};

export type FriendLink = {
  name: string;
  url: string;
  avatar: string;
  description: string;
  tags: string[];
  rss?: string;
  featured?: boolean;
};

export type ContactItem = {
  label: string;
  value: string;
  href: string;
  type: "email" | "github" | "social" | "location";
};

export type ProfileConfig = {
  name: string;
  headline: string;
  intro: string;
  skills: string[];
  hobbies: string[];
  contacts: ContactItem[];
  github: string;
  motto: string;
  portraitAsset: string;
  aboutKeywords: string[];
  journey: { title: string; description: string }[];
};
