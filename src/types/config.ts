// ─── Config / Regional types ──────────────────────────────────────────────────

export interface ConfigTournamentCategory {
  id: number;
  name: string;
  slug: string;
  flag: string | null;
}

export interface TopUniqueTournament {
  id: number;
  name: string;
  slug: string;
  primaryColorHex: string | null;
  secondaryColorHex: string | null;
  userCount: number;
  category: ConfigTournamentCategory;
}

export interface SportInfo {
  id: number;
  slug: string;
  name: string;
}

export interface CountrySportPriority {
  country: string;
  sport: SportInfo;
  position: number;
}

export interface TournamentSeason {
  id: number;
  name: string;
  year: string;
  editor: boolean;
}
