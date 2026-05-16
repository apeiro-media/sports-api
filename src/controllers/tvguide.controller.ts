import type { Context } from 'hono';
import { getTvGuide } from '../services/tvguide.service';
import { notModified } from '../utils/cache';

const CACHE_CONTROL = 'public, s-maxage=300, stale-while-revalidate=900';

const COUNTRY_RE = /^[A-Za-z]{2,3}$/;
const TIMEZONE_RE = /^[A-Za-z0-9_\-+/]{1,64}$/;

export async function tvGuideController(c: Context) {
  const country = (c.req.query('country') || 'US').trim();
  const timezone = (c.req.query('timezone') || 'Africa/Casablanca').trim();

  if (!COUNTRY_RE.test(country)) {
    return c.json({ error: 'Invalid country code' }, 400);
  }
  if (!TIMEZONE_RE.test(timezone)) {
    return c.json({ error: 'Invalid timezone' }, 400);
  }

  try {
    const result = await getTvGuide(country.toLowerCase(), timezone);

    if (c.req.header('if-none-match') === result.etag) {
      return notModified(result.etag, 300, 900);
    }

    return c.json(
      { ...result.payload, updatedAt: result.updatedAt },
      200,
      { ETag: result.etag, 'Cache-Control': CACHE_CONTROL },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Fetch failed';
    console.error('[tvguide] failed:', message);
    return c.json({ error: message }, 502);
  }
}
