import type { ScheduledTournament, ScheduledTournamentsPage } from '../types';
import type { SofaScheduledTournamentsResponse } from '../providers/sofascore/types';

/**
 * Transforms raw SofaScore scheduled-tournaments response into our domain model.
 * Sums timezoneEventCount values to produce a total eventCount per tournament.
 */
export function transformScheduledTournaments(
  raw: SofaScheduledTournamentsResponse['scheduled'],
  page: number,
): ScheduledTournamentsPage {
  const scheduled: ScheduledTournament[] = raw.map((item) => {
    const t = item.tournament ?? {};
    const ut = item.uniqueTournament ?? {};
    const cat = ut.category ?? {};

    // Sum all timezone event counts
    const eventCount = item.timezoneEventCount
      ? Object.values(item.timezoneEventCount).reduce((acc, v) => acc + (v ?? 0), 0)
      : 0;

    return {
      tournament: {
        id: t.id ?? 0,
        name: t.name ?? '',
        slug: t.slug ?? '',
        priority: t.priority ?? 0,
      },
      uniqueTournament: {
        id: ut.id ?? 0,
        name: ut.name ?? '',
        slug: ut.slug ?? '',
        userCount: ut.userCount ?? 0,
        primaryColorHex: ut.primaryColorHex ?? null,
        secondaryColorHex: ut.secondaryColorHex ?? null,
        hasEventPlayerStatistics: ut.hasEventPlayerStatistics ?? false,
        category: {
          id: cat.id ?? 0,
          name: cat.name ?? '',
          flag: cat.flag ?? null,
          alpha2: cat.alpha2 ?? null,
        },
      },
      eventCount,
    };
  });

  // SofaScore returns an empty array when there are no more pages
  return { scheduled, hasNextPage: scheduled.length > 0, page };
}
