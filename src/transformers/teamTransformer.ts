import type {
  TeamInfo,
  TeamVenue,
  TeamManager,
  SquadPlayer,
  Transfer,
  Achievement,
  TeamRanking,
  PerformanceEntry,
  TeamMedia,
  TeamTweet,
} from '../types/teamDetail';
import type { TranslatedString, Country } from '../types/common';
import type { Match } from '../types/match';
import { transformMatch } from './matchTransformer';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildName(name?: string, translations?: any): TranslatedString {
  return { en: name ?? null, ar: translations?.ar ?? null };
}

function buildCountry(raw?: any): Country {
  return {
    name: buildName(raw?.name, raw?.fieldTranslations?.nameTranslation),
    alpha2: raw?.alpha2 ?? null,
    alpha3: raw?.alpha3 ?? null,
  };
}

// ─── Team info ────────────────────────────────────────────────────────────────

export function transformTeamInfo(raw: any): TeamInfo {
  const t = raw?.team ?? raw;
  const v = t.venue;
  const m = t.manager;

  const venue: TeamVenue | null = v
    ? {
        id: v.id ?? 0,
        name: v.stadium?.name ?? v.name ?? '',
        city: v.city?.name ?? null,
        capacity: v.stadium?.capacity ?? v.capacity ?? null,
        country: v.country?.name ?? null,
      }
    : null;

  const manager: TeamManager | null = m
    ? {
        id: m.id ?? 0,
        name: m.name ?? '',
        shortName: m.shortName ?? m.name ?? '',
        nationality: m.country?.name ?? null,
      }
    : null;

  return {
    id: t.id ?? 0,
    name: buildName(t.name, t.fieldTranslations?.nameTranslation),
    shortName: buildName(t.shortName ?? t.name, t.fieldTranslations?.shortNameTranslation),
    nameCode: t.nameCode ?? '',
    national: t.national ?? false,
    gender: t.gender ?? null,
    userCount: t.userCount ?? 0,
    foundationDateTimestamp: t.foundationDateTimestamp ?? null,
    venue,
    manager,
    country: buildCountry(t.country),
    colors: {
      primary: t.teamColors?.primary ?? '#000000',
      secondary: t.teamColors?.secondary ?? '#000000',
      text: t.teamColors?.text ?? '#ffffff',
    },
    parentTeamId: t.parentTeam?.id ?? null,
    subTeamIds: t.subTeams?.map((s: any) => s.id) ?? [],
  };
}

// ─── Squad ────────────────────────────────────────────────────────────────────

export function transformSquad(raw: any): SquadPlayer[] {
  const entries: any[] = raw?.players ?? [];
  return entries.map((entry) => {
    const p = entry.player ?? entry;
    const dob: number | null = p.dateOfBirthTimestamp ?? null;
    return {
      id: p.id ?? 0,
      name: p.name ?? '',
      shortName: p.shortName ?? p.name ?? '',
      position: p.position ?? null,
      jerseyNumber: p.jerseyNumber ?? null,
      dateOfBirthTimestamp: dob,
      height: p.height ?? null,
      nationality: p.country?.name ?? null,
      countryAlpha2: p.country?.alpha2 ?? null,
      marketValue: entry.marketValue ?? null,
      marketValueCurrency: entry.marketValueCurrency ?? null,
    };
  });
}

// ─── Transfers ────────────────────────────────────────────────────────────────

export function transformTransfers(raw: any, teamId: number): Transfer[] {
  const history: any[] = raw?.transferHistory ?? [];
  return history.map((t, idx) => {
    const isIn = t.transferTo?.id === teamId;
    return {
      id: t.id ?? idx,
      playerName: t.player?.name ?? '',
      playerId: t.player?.id ?? null,
      type: isIn ? 'in' : 'out',
      transferFee: t.fee ?? null,
      transferFeeDescription: t.feeDescription ?? null,
      fromTeamId: t.transferFrom?.id ?? null,
      fromTeamName: t.transferFrom?.name ?? null,
      toTeamId: t.transferTo?.id ?? null,
      toTeamName: t.transferTo?.name ?? null,
      transferDateTimestamp: t.transferDateTimestamp ?? null,
    };
  });
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export function transformAchievements(raw: any): Achievement[] {
  const items: any[] = raw?.uniqueTournamentSeasons ?? [];
  return items.map((item) => ({
    id: item.id ?? 0,
    tournamentId: item.uniqueTournament?.id ?? null,
    tournamentName: item.uniqueTournament?.name ?? null,
    seasons: (item.seasons ?? []).map((s: any) => ({
      year: s.year ?? s.name ?? '',
      name: s.name ?? '',
    })),
  }));
}

// ─── Ranking ──────────────────────────────────────────────────────────────────

export function transformRanking(raw: any): TeamRanking {
  const r = raw?.ranking ?? raw;
  return {
    position: r?.ranking ?? null,
    points: r?.points ?? null,
  };
}

// ─── Performance ──────────────────────────────────────────────────────────────

export function transformPerformance(raw: any, teamId: number): PerformanceEntry[] {
  const events: any[] = raw?.events ?? raw?.performance ?? [];
  return events.map((e) => {
    const isHome = e.homeTeam?.id === teamId;
    const opponent = isHome ? e.awayTeam : e.homeTeam;
    const scored = isHome ? (e.homeScore?.current ?? 0) : (e.awayScore?.current ?? 0);
    const conceded = isHome ? (e.awayScore?.current ?? 0) : (e.homeScore?.current ?? 0);
    let result: 'W' | 'D' | 'L' = 'D';
    if (e.winnerCode === 3) result = 'D';
    else if ((isHome && e.winnerCode === 1) || (!isHome && e.winnerCode === 2)) result = 'W';
    else result = 'L';
    return {
      eventId: e.id ?? 0,
      opponentId: opponent?.id ?? 0,
      opponentName: opponent?.name ?? '',
      opponentNameCode: opponent?.nameCode ?? '',
      isHome,
      result,
      goalsScored: scored,
      goalsConceded: conceded,
      startTimestamp: e.startTimestamp ?? 0,
    };
  });
}

// ─── Team events (reuse match transformer) ────────────────────────────────────

export function transformTeamEvents(raw: any): Match[] {
  return (raw?.events ?? []).map(transformMatch);
}

// ─── Media ────────────────────────────────────────────────────────────────────

export function transformTeamMedia(raw: any): TeamMedia[] {
  const items: any[] = raw?.media ?? raw?.items ?? [];
  return items.map((m) => ({
    id: m.id ?? 0,
    title: m.title ?? '',
    url: m.url ?? '',
    thumbnailUrl: m.thumbnailUrl ?? m.image ?? null,
    mediaType: m.mediaType ?? 0,
    sourceUrl: m.sourceUrl ?? m.url ?? '',
  }));
}

// ─── Official tweets ──────────────────────────────────────────────────────────

export function transformTeamTweets(raw: any): TeamTweet[] {
  const tweets: any[] = raw?.officialTweets ?? raw?.tweets ?? [];
  return tweets.map((t) => ({
    id: String(t.id ?? t.tweetId ?? ''),
    text: t.text ?? t.body ?? '',
    url: t.url ?? t.tweetUrl ?? '',
    createdAt: t.createdAt ?? null,
  }));
}
