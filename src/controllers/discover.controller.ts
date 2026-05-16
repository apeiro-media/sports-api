import type { Context } from 'hono';
import { pickLang } from '../middleware/lang';
import { notModified } from '../utils/cache';
import {
  getScheduledTournaments,
  getTrendingPlayers,
  getNewsFeed,
  getFeaturedEvents,
  getTopTournaments,
  getCountrySportPriorities,
  getTournamentSeasons,
} from '../services/discover.service';

// ─── Cache-Control presets ────────────────────────────────────────────────────

const CACHE_DYNAMIC    = 'public, s-maxage=300,  stale-while-revalidate=60';   // 5min
const CACHE_TRENDING   = 'public, s-maxage=120,  stale-while-revalidate=60';   // 2min
const CACHE_NEWS       = 'public, s-maxage=600,  stale-while-revalidate=120';  // 10min
const CACHE_FEATURED   = 'public, s-maxage=60,   stale-while-revalidate=30';   // 1min
const CACHE_STATIC     = 'public, s-maxage=3600, stale-while-revalidate=300';  // 1hr
const CACHE_PRIORITIES = 'public, s-maxage=86400,stale-while-revalidate=3600'; // 24hr

// ─── Helpers ─────────────────────────────────────────────────────────────────

function jsonOk(c: Context, data: unknown, etag: string, cacheControl: string) {
  return c.json(data, 200, { ETag: etag, 'Cache-Control': cacheControl });
}

function jsonError(c: Context, message: string, status: 400 | 500 | 502 = 502) {
  return c.json({ error: message }, status);
}

function handle304(c: Context, etag: string, sMaxAge: number, stale: number) {
  if (c.req.header('if-none-match') === etag) {
    return notModified(etag, sMaxAge, stale);
  }
  return null;
}

// ─── Controllers ─────────────────────────────────────────────────────────────

export async function scheduledTournamentsController(c: Context) {
  const sport = c.req.param('sport') ?? 'football';
  const date  = c.req.param('date')  ?? new Date().toISOString().slice(0, 10);
  const page  = Math.max(1, parseInt(c.req.query('page') || '1', 10));

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return jsonError(c, 'Invalid date format', 400);
  if (!/^[a-z-]+$/i.test(sport))         return jsonError(c, 'Invalid sport', 400);

  try {
    const result = await getScheduledTournaments(sport, date, page);
    const not304 = handle304(c, result.etag, 300, 60);
    if (not304) return not304;
    return jsonOk(c, { ...result.payload, updatedAt: result.updatedAt }, result.etag, CACHE_DYNAMIC);
  } catch (err: any) {
    console.error('[scheduledTournaments] failed:', err);
    return jsonError(c, err.message || 'Fetch failed');
  }
}

export async function trendingPlayersController(c: Context) {
  const sport = c.req.param('sport') ?? 'football';
  if (!/^[a-z-]+$/i.test(sport)) return jsonError(c, 'Invalid sport', 400);

  try {
    const result = await getTrendingPlayers(sport);
    const not304 = handle304(c, result.etag, 120, 60);
    if (not304) return not304;
    return jsonOk(c, { players: result.payload, updatedAt: result.updatedAt }, result.etag, CACHE_TRENDING);
  } catch (err: any) {
    console.error('[trendingPlayers] failed:', err);
    return jsonError(c, err.message || 'Fetch failed');
  }
}

export async function newsFeedController(c: Context) {
  const lang    = pickLang(c);
  const page    = Math.max(1, parseInt(c.req.query('page')     || '1',  10));
  const perPage = Math.min(50, Math.max(1, parseInt(c.req.query('per_page') || '12', 10)));

  try {
    const result = await getNewsFeed(lang, page, perPage);
    const not304 = handle304(c, result.etag, 600, 120);
    if (not304) return not304;
    return jsonOk(c, { ...result.payload, updatedAt: result.updatedAt }, result.etag, CACHE_NEWS);
  } catch (err: any) {
    console.error('[newsFeed] failed:', err);
    return jsonError(c, err.message || 'Fetch failed');
  }
}

export async function featuredEventsController(c: Context) {
  const sport = c.req.param('sport') ?? 'football';
  if (!/^[a-z-]+$/i.test(sport)) return jsonError(c, 'Invalid sport', 400);

  try {
    const result = await getFeaturedEvents(sport);
    const not304 = handle304(c, result.etag, 60, 30);
    if (not304) return not304;
    return jsonOk(c, { events: result.payload, updatedAt: result.updatedAt }, result.etag, CACHE_FEATURED);
  } catch (err: any) {
    console.error('[featuredEvents] failed:', err);
    return jsonError(c, err.message || 'Fetch failed');
  }
}

export async function topTournamentsController(c: Context) {
  const country = c.req.param('country') ?? 'MA';
  const sport   = c.req.param('sport')   ?? 'football';
  if (!/^[A-Z]{2,3}$/i.test(country)) return jsonError(c, 'Invalid country code', 400);
  if (!/^[a-z-]+$/i.test(sport))      return jsonError(c, 'Invalid sport', 400);

  try {
    const result = await getTopTournaments(country, sport);
    const not304 = handle304(c, result.etag, 3600, 300);
    if (not304) return not304;
    return jsonOk(c, { tournaments: result.payload, updatedAt: result.updatedAt }, result.etag, CACHE_STATIC);
  } catch (err: any) {
    console.error('[topTournaments] failed:', err);
    return jsonError(c, err.message || 'Fetch failed');
  }
}

export async function countrySportPrioritiesController(c: Context) {
  const country = c.req.param('country') ?? 'MA';
  if (!/^[A-Z]{2,3}$/i.test(country)) return jsonError(c, 'Invalid country code', 400);

  try {
    const result = await getCountrySportPriorities(country);
    const not304 = handle304(c, result.etag, 86400, 3600);
    if (not304) return not304;
    return jsonOk(c, { priorities: result.payload, updatedAt: result.updatedAt }, result.etag, CACHE_PRIORITIES);
  } catch (err: any) {
    console.error('[countrySportPriorities] failed:', err);
    return jsonError(c, err.message || 'Fetch failed');
  }
}

export async function tournamentSeasonsController(c: Context) {
  const tournamentId = c.req.param('tournamentId') ?? '';
  if (!/^\d+$/.test(tournamentId)) return jsonError(c, 'Invalid tournament ID', 400);

  try {
    const result = await getTournamentSeasons(parseInt(tournamentId, 10));
    const not304 = handle304(c, result.etag, 3600, 300);
    if (not304) return not304;
    return jsonOk(c, { seasons: result.payload, updatedAt: result.updatedAt }, result.etag, CACHE_STATIC);
  } catch (err: any) {
    console.error(`[tournamentSeasons:${tournamentId}] failed:`, err);
    return jsonError(c, err.message || 'Fetch failed');
  }
}
