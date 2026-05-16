import type { Context } from 'hono';
import { pickLang } from '../middleware/lang';
import { notModified } from '../utils/cache';
import {
  getLiveEvents,
  getScheduledEvents,
  getTournamentRoundEvents,
} from '../services/events.service';

// ─── Cache-Control presets ───────────────────────────────────────────────────

const CACHE_LIVE     = 'public, s-maxage=10, stale-while-revalidate=30';
const CACHE_SCHEDULE = 'public, s-maxage=60, stale-while-revalidate=120';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function jsonOk(c: Context, data: unknown, etag: string, cacheControl: string) {
  return c.json(data, 200, { 'ETag': etag, 'Cache-Control': cacheControl });
}

function jsonError(c: Context, message: string, status = 502) {
  return c.json({ error: message }, status);
}

// ─── Controller handlers ─────────────────────────────────────────────────────

export async function liveController(c: Context) {
  const lang = pickLang(c);
  try {
    const result = await getLiveEvents(lang);

    if (c.req.header('if-none-match') === result.etag) {
      return notModified(result.etag, 10, 30);
    }

    return jsonOk(
      c,
      { events: result.payload, updatedAt: result.updatedAt },
      result.etag,
      CACHE_LIVE,
    );
  } catch (err: any) {
    console.error('[live] failed:', err);
    return jsonError(c, err.message || 'Fetch failed');
  }
}

export async function todayController(c: Context) {
  const lang = pickLang(c);
  const date = c.req.query('date') || new Date().toISOString().slice(0, 10);
  try {
    const result = await getScheduledEvents(date, lang);

    if (c.req.header('if-none-match') === result.etag) {
      return notModified(result.etag, 10, 30);
    }

    return jsonOk(
      c,
      { events: result.payload, updatedAt: result.updatedAt },
      result.etag,
      CACHE_LIVE,
    );
  } catch (err: any) {
    console.error('[today] failed:', err);
    return jsonError(c, err.message || 'Fetch failed');
  }
}

export async function scheduleController(c: Context) {
  const date = c.req.param('date');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return jsonError(c, 'Invalid date format', 400);
  }

  const lang = pickLang(c);
  try {
    const result = await getScheduledEvents(date, lang);

    if (c.req.header('if-none-match') === result.etag) {
      return notModified(result.etag, 60, 120);
    }

    return jsonOk(
      c,
      { events: result.payload, updatedAt: result.updatedAt },
      result.etag,
      CACHE_SCHEDULE,
    );
  } catch (err: any) {
    console.error('[schedule] failed:', err);
    return jsonError(c, err.message || 'Fetch failed');
  }
}

export async function tournamentRoundController(c: Context) {
  const tournamentId = c.req.param('tournamentId');
  const seasonId = c.req.param('seasonId');
  const round = c.req.param('round');

  // Validate all params are numeric to prevent path traversal
  if (!/^\d+$/.test(tournamentId) || !/^\d+$/.test(seasonId) || !/^\d+$/.test(round)) {
    return jsonError(c, 'Invalid tournament, season, or round ID', 400);
  }

  const lang = pickLang(c);

  try {
    const result = await getTournamentRoundEvents(tournamentId, seasonId, round, lang);

    if (c.req.header('if-none-match') === result.etag) {
      return notModified(result.etag, 60, 120);
    }

    return jsonOk(
      c,
      { events: result.payload, updatedAt: result.updatedAt },
      result.etag,
      CACHE_SCHEDULE,
    );
  } catch (err: any) {
    console.error(`[tournament ${tournamentId} round ${round}] failed:`, err);
    return jsonError(c, err.message || 'Fetch failed');
  }
}
