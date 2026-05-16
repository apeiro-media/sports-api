import type { NewsPost, NewsFeed } from '../types';
import type { SofaNewsPostRaw } from '../providers/sofascore/types';

/**
 * Transforms a raw SofaScore news post into our domain model.
 */
export function transformNewsPost(raw: SofaNewsPostRaw): NewsPost {
  return {
    id: raw.id ?? 0,
    slug: raw.slug ?? '',
    date: raw.date ?? '',
    title: raw.title ?? '',
    excerpt: raw.excerpt ?? '',
    imageUrl: raw.imageUrl ?? null,
    tags: (raw.tags ?? []).map((tag) => ({
      id: tag.id ?? 0,
      slug: tag.slug ?? '',
      name: tag.name ?? '',
    })),
  };
}

export function transformNewsFeed(
  raw: SofaNewsPostRaw[],
  page: number,
  perPage: number,
): NewsFeed {
  return {
    posts: raw.map(transformNewsPost),
    page,
    perPage,
  };
}
