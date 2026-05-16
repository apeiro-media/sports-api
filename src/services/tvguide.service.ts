import { computeEtag } from '../utils/cache';

const FOTMOB_TVGUIDE_URL = 'https://www.fotmob.com/api/data/tvguide';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TvGuideChannel {
  name: string;
  imageUrl?: string;
}

export interface TvGuideAffiliate {
  langCode?: string;
  title?: string;
  subtitle?: string;
  link: string;
  callToAction?: string;
  imageUrl?: string;
  disclaimer?: string;
}

export interface TvGuideMatch {
  id: number;
  utcTime: string;
  home: { id: number; name: string };
  away: { id: number; name: string };
  leagueId: number;
  leagueName: string;
  leagueCcode?: string;
  tvChannels: string[];
  channels: TvGuideChannel[];
  affiliates: TvGuideAffiliate[];
  isLive: boolean;
}

export interface TvGuideLeagueGroup {
  leagueId: number;
  leagueName: string;
  leagueCcode?: string;
  matches: TvGuideMatch[];
}

export interface TvGuideDay {
  /** YYYY-MM-DD */
  date: string;
  leagues: TvGuideLeagueGroup[];
}

export interface TvGuideResult {
  payload: { days: TvGuideDay[] };
  etag: string;
  updatedAt: number;
}

// ─── Raw fotmob types ────────────────────────────────────────────────────────

interface RawMatch {
  id: number;
  utcTime: string;
  home: { id: number; name: string };
  away: { id: number; name: string };
  leagueId: number;
  leagueName: string;
  leagueCcode?: string;
  tvChannels?: string[];
  channels?: TvGuideChannel[];
  affiliates?: TvGuideAffiliate[];
  isLive?: boolean;
}

interface RawLeague {
  key: number;
  leagueId: number;
  leagueName: string;
  leagueCcode?: string;
  matches: RawMatch[];
}

type RawTvGuide = Record<string, RawLeague[]>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert "YYYYMMDD" → "YYYY-MM-DD". */
function formatDateKey(key: string): string {
  if (!/^\d{8}$/.test(key)) return key;
  return `${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(6, 8)}`;
}

function dedupe<T>(arr: T[], keyFn: (x: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of arr) {
    const k = keyFn(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

function shapeMatch(m: RawMatch): TvGuideMatch {
  return {
    id: m.id,
    utcTime: m.utcTime,
    home: m.home,
    away: m.away,
    leagueId: m.leagueId,
    leagueName: m.leagueName,
    leagueCcode: m.leagueCcode,
    tvChannels: m.tvChannels ?? [],
    channels: dedupe(m.channels ?? [], (c) => c.name),
    affiliates: dedupe(m.affiliates ?? [], (a) => a.link),
    isLive: Boolean(m.isLive),
  };
}

function shapeDay(rawKey: string, leagues: RawLeague[]): TvGuideDay {
  return {
    date: formatDateKey(rawKey),
    leagues: leagues.map((lg) => ({
      leagueId: lg.leagueId,
      leagueName: lg.leagueName,
      leagueCcode: lg.leagueCcode,
      matches: (lg.matches ?? []).map(shapeMatch),
    })),
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Fetch the fotmob TV guide for the given country & timezone, normalised
 * into `{ days: [{ date, leagues: [{ matches }] }] }`.
 */
export async function getTvGuide(
  country: string,
  timezone: string,
): Promise<TvGuideResult> {
  const url = new URL(FOTMOB_TVGUIDE_URL);
  url.searchParams.set('country', country);
  url.searchParams.set('timezone', timezone);

  const res = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    },
  });

  if (!res.ok) {
    throw new Error(`fotmob tvguide HTTP ${res.status}`);
  }

  const raw = (await res.json()) as RawTvGuide;

  const days: TvGuideDay[] = Object.keys(raw)
    .sort()
    .map((k) => shapeDay(k, raw[k] ?? []));

  const payload = { days };
  return {
    payload,
    etag: computeEtag(payload),
    updatedAt: Date.now(),
  };
}
