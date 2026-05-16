// ─── News types ───────────────────────────────────────────────────────────────

export interface NewsTag {
  id: number;
  slug: string;
  name: string;
}

export interface NewsPost {
  id: number;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  tags: NewsTag[];
}

export interface NewsFeed {
  posts: NewsPost[];
  page: number;
  perPage: number;
}
