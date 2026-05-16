// ─── Scheduled Tournament types ───────────────────────────────────────────────

export interface ScheduledTournamentCategory {
  id: number;
  name: string;
  flag: string | null;
  alpha2: string | null;
}

export interface ScheduledUniqueTournament {
  id: number;
  name: string;
  slug: string;
  userCount: number;
  primaryColorHex: string | null;
  secondaryColorHex: string | null;
  hasEventPlayerStatistics: boolean;
  category: ScheduledTournamentCategory;
}

export interface ScheduledTournament {
  tournament: {
    id: number;
    name: string;
    slug: string;
    priority: number;
  };
  uniqueTournament: ScheduledUniqueTournament;
  /** Total number of events in this tournament for the given date (summed across timezones) */
  eventCount: number;
}

export interface ScheduledTournamentsPage {
  scheduled: ScheduledTournament[];
  hasNextPage: boolean;
  page: number;
}
