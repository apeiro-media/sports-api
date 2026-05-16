/** DJB2 Etag computation for caching */
export function computeEtag(data: unknown): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return `"${Math.abs(hash).toString(36)}"`;
}

/** Create a 304 Not Modified response */
export function notModified(etag: string, sMaxAge: number, stale: number): Response {
  return new Response(null, {
    status: 304,
    headers: {
      'ETag': etag,
      'Cache-Control': `public, s-maxage=${sMaxAge}, stale-while-revalidate=${stale}`,
    },
  });
}
