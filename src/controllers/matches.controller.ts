import type { Context } from 'hono';
import { pickLang } from '../middleware/lang';
import { getScheduledEvents } from '../services/events.service';
import type { PaginatedMatches } from '../types';

export async function matchesController(c: Context) {
  const lang      = pickLang(c);
  const page      = Number(c.req.query('page')      ?? 1);
  const pageSize  = Number(c.req.query('pageSize')  ?? 20);
  const status    = c.req.query('status');    // inprogress | finished | notstarted
  const league    = c.req.query('league');    // tournament name en
  const country   = c.req.query('country');   // country name en
  const period    = c.req.query('period');    // 1st half | 2nd half | Halftime
  const gender    = c.req.query('gender');    // M | F
  const level     = c.req.query('level');     // top-competitions | pro | youth | contributor
  const category  = c.req.query('category');  // club | national
  const date      = c.req.query('date') || new Date().toISOString().slice(0, 10);

  try {
    // Provider already transforms raw events into Match[]
    const { payload } = await getScheduledEvents(date, lang);

    const filtered = payload
      .filter((m) => !status   || m.status.type === status)
      .filter((m) => !period   || m.status.description === period)
      .filter((m) => !league   || m.tournament.name.en === league)
      .filter((m) => !country  || m.tournament.country.name.en === country)
      .filter((m) => !gender   || m.filters.gender.includes(gender))
      .filter((m) => !level    || m.filters.level.includes(level))
      .filter((m) => !category || m.filters.category.includes(category));

    const start = (page - 1) * pageSize;

    const response: PaginatedMatches = {
      page,
      pageSize,
      total: filtered.length,
      matches: filtered.slice(start, start + pageSize),
    };

    return c.json(response);
  } catch (err: any) {
    console.error('[matches] failed:', err);
    return c.json({ error: err.message || 'Fetch failed' }, 502);
  }
}
