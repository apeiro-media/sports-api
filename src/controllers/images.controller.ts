import type { Context } from 'hono';
import {
  getImage,
  ProviderValidationError,
  ProviderUpstreamError,
} from '../services/images.service';

export async function imageProxyController(c: Context) {
  const imgType = c.req.param('type');
  const imgId = c.req.param('id');

  if (!/^\d+$/.test(imgId)) {
    return c.json({ error: 'Invalid ID' }, 400);
  }

  try {
    const result = await getImage(imgType, imgId);

    return new Response(result.body, {
      status: 200,
      headers: {
        'Content-Type': result.contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err) {
    if (err instanceof ProviderValidationError) {
      return c.json({ error: err.message }, 400);
    }
    if (err instanceof ProviderUpstreamError) {
      return new Response(null, { status: err.statusCode });
    }
    return new Response(null, { status: 502 });
  }
}
