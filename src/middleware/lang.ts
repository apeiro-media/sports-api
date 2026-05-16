import type { Context } from 'hono';

/**
 * Extract the preferred language from query params or Accept-Language header.
 * Returns a clean language code (e.g. 'ar', 'en', 'fr').
 */
export function pickLang(c: Context): string {
  return (
    c.req.query('lang') ||
    c.req.header('accept-language')?.split(',')[0]?.split(';')[0] ||
    'en'
  );
}
