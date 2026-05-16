import type { Match, MatchEvent } from './index';

export interface TeamColors {
  primary: string;
  secondary: string;
  text: string;
}

export interface Team {
  name: string;
  shortName: string;
  id: number;
  nameCode?: string;
  colors?: TeamColors;
  teamColors?: TeamColors;
}

export interface StandingRow {
  team: Team;
  position: number;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  scoresFor: number;
  scoresAgainst: number;
  points: number;
  scoreDiffFormatted: string;
  promotion?: { text: string; id: number };
}

export interface SeasonInfo {
  season: { name: string; year: string; id: number };
  goals: number;
  homeTeamWins: number;
  awayTeamWins: number;
  draws: number;
  yellowCards: number;
  redCards: number;
  numberOfCompetitors: number;
  newcomersLowerDivision: Team[];
}

export interface RoundsData {
  currentRound: { round: number };
  rounds: { round: number }[];
}

export interface TOTWPeriod {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

export interface PlayerOfSeasonEntry {
  statistics: { rating: number; appearances: number };
  player: { name: string; shortName: string; position: string; id: number };
  team: Team;
}

export interface PerformanceGraphEntry {
  events: MatchEvent[];
  week: number;
  position: number;
}
