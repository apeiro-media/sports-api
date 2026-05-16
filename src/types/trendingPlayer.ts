// ─── Trending Player types ────────────────────────────────────────────────────

export interface TrendingPlayerInfo {
  id: number;
  name: string;
  shortName: string;
  slug: string;
  position: string;
  jerseyNumber: string | null;
  height: number | null;
  userCount: number;
  dateOfBirthTimestamp: number | null;
  proposedMarketValue: number | null;
  proposedMarketValueCurrency: string | null;
}

export interface TrendingPlayerTeam {
  id: number;
  name: string;
  shortName: string;
  slug: string;
  nameCode: string;
  primaryColor: string | null;
  secondaryColor: string | null;
}

export interface TrendingPlayerEventSummary {
  id: number;
  slug: string;
  startTimestamp: number;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number | null;
  awayScore: number | null;
  statusType: string;
}

export interface TrendingPlayerStats {
  rating: number;
  goals: number | null;
  goalAssist: number | null;
  minutesPlayed: number;
  totalShots: number | null;
  expectedGoals: number | null;
  saves: number | null;
  keeperSaveValue: number | null;
}

export interface TrendingPlayer {
  player: TrendingPlayerInfo;
  team: TrendingPlayerTeam;
  event: TrendingPlayerEventSummary;
  stats: TrendingPlayerStats;
}
