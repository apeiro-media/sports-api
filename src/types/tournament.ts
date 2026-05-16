import { TranslatedString, Country } from './common';

export interface TournamentColors {
  primary: string;
  secondary: string;
}

export interface Season {
  id: number;
  name: string;
  year: string;
}

export interface Round {
  number: number;
  name: string | null;
  slug: string | null;
  cupRoundType: number | null;       // 1=Final 2=Semi 4=QF 8=R16 16=R32
  totalMatchesInRound: number | null; // retained: know how many legs exist in this round
}

export interface Tournament {
  // --- Identity ---
  id: number;                        // uniqueTournament.id
  categoryId: number;                // category.id — fetch standings: /api/v1/category/{id}/standings
  priority: number;
  isGroup: boolean;
  groupName: string | null;
  groupSign: string | null;
  isLive: boolean;
  userCount: number;

  // --- Names (translated) ---
  name: TranslatedString;

  // --- Appearance ---
  colors: TournamentColors;

  // --- Location ---
  country: Country;

  // --- Season ---
  season: Season;

  // --- Round ---
  round: Round;

  // --- Feature flags ---
  hasEventPlayerStatistics: boolean;
  displayInverseHomeAwayTeams: boolean;
  hasPerformanceGraphFeature: boolean;  // retained: know if /performance-graph endpoint is available
}
