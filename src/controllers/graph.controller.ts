import type { Context } from 'hono';
import { notModified } from '../utils/cache';
import { getEventGraph } from '../services/graph.service';

const CACHE_GRAPH = 'public, s-maxage=30, stale-while-revalidate=60';

export async function graphController(c: Context) {
  const eventId = c.req.param('eventId');

  if (!/^\d+$/.test(eventId)) {
    return c.json({ error: 'Invalid event ID' }, 400);
  }

  try {
    const result = await getEventGraph(eventId);

    if (c.req.header('if-none-match') === result.etag) {
      return notModified(result.etag, 30, 60);
    }

    return c.json(result.payload, 200, {
      'ETag': result.etag,
      'Cache-Control': CACHE_GRAPH,
    });
  } catch (err: any) {
    console.error(`[graph ${eventId}] failed:`, err);
    return c.json({ error: err.message || 'Fetch failed' }, 502);
  }
}
