import type {
  TopUniqueTournament,
  CountrySportPriority,
  TournamentSeason,
} from '../types';
import type {
  SofaTopTournamentsResponse,
  SofaCountryPrioritiesResponse,
  SofaSeasonsResponse,
} from '../providers/sofascore/types';

// ─── Top Unique Tournaments ───────────────────────────────────────────────────

export function transformTopTournaments(
  raw: SofaTopTournamentsResponse['uniqueTournaments'],
): TopUniqueTournament[] {
  return (raw ?? []).map((ut) => {
    const cat = ut.category ?? {};
    return {
      id: ut.id ?? 0,
      name: ut.name ?? '',
      slug: ut.slug ?? '',
      primaryColorHex: ut.primaryColorHex ?? null,
      secondaryColorHex: ut.secondaryColorHex ?? null,
      userCount: ut.userCount ?? 0,
      category: {
        id: cat.id ?? 0,
        name: cat.name ?? '',
        slug: cat.slug ?? '',
        flag: cat.flag ?? null,
      },
    };
  });
}

// ─── Country Sport Priorities ─────────────────────────────────────────────────

export function transformCountrySportPriorities(
  raw: SofaCountryPrioritiesResponse['countrySportPriorities'],
): CountrySportPriority[] {
  return (raw ?? []).map((item) => ({
    country: item.country ?? '',
    sport: {
      id: item.sport?.id ?? 0,
      slug: item.sport?.slug ?? '',
      name: item.sport?.name ?? '',
    },
    position: item.position ?? 0,
  }));
}

// ─── Tournament Seasons ───────────────────────────────────────────────────────

export function transformTournamentSeasons(
  raw: SofaSeasonsResponse['seasons'],
): TournamentSeason[] {
  return (raw ?? []).map((s) => ({
    id: s.id ?? 0,
    name: s.name ?? '',
    year: s.year ?? '',
    editor: s.editor ?? false,
  }));
}
