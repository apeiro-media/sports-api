import type { TrendingPlayer } from '../types';
import type { SofaTrendingPlayerRaw } from '../providers/sofascore/types';

/**
 * Transforms a raw SofaScore trending top-player entry into our domain model.
 */
export function transformTrendingPlayer(raw: SofaTrendingPlayerRaw): TrendingPlayer {
  const p = raw.player ?? {};
  const t = raw.team ?? {};
  const e = raw.event ?? { id: 0 };

  return {
    player: {
      id: p.id ?? 0,
      name: p.name ?? '',
      shortName: p.shortName ?? p.name ?? '',
      slug: p.slug ?? '',
      position: p.position ?? '',
      jerseyNumber: p.jerseyNumber ?? null,
      height: p.height ?? null,
      userCount: p.userCount ?? 0,
      dateOfBirthTimestamp: p.dateOfBirthTimestamp ?? null,
      proposedMarketValue: p.proposedMarketValueRaw?.value ?? null,
      proposedMarketValueCurrency: p.proposedMarketValueRaw?.currency ?? null,
    },
    team: {
      id: t.id ?? 0,
      name: t.name ?? '',
      shortName: t.shortName ?? t.name ?? '',
      slug: t.slug ?? '',
      nameCode: t.nameCode ?? '',
      primaryColor: t.teamColors?.primary ?? null,
      secondaryColor: t.teamColors?.secondary ?? null,
    },
    event: {
      id: e.id ?? 0,
      slug: e.slug ?? '',
      startTimestamp: e.startTimestamp ?? 0,
      homeTeamName: (e as any).homeTeam?.name ?? '',
      awayTeamName: (e as any).awayTeam?.name ?? '',
      homeScore: (e as any).homeScore?.current ?? null,
      awayScore: (e as any).awayScore?.current ?? null,
      statusType: e.status?.type ?? '',
    },
    stats: {
      rating: raw.rating ?? 0,
      goals: raw.goals ?? null,
      goalAssist: raw.goalAssist ?? null,
      minutesPlayed: raw.minutesPlayed ?? 0,
      totalShots: raw.totalShots ?? null,
      expectedGoals: raw.expectedGoals ?? null,
      saves: raw.saves ?? null,
      keeperSaveValue: raw.keeperSaveValue ?? null,
    },
  };
}

export function transformTrendingPlayers(raw: SofaTrendingPlayerRaw[]): TrendingPlayer[] {
  return raw.map(transformTrendingPlayer);
}
