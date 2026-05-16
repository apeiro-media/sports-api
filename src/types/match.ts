import { Team } from './team';
import { Tournament } from './tournament';

export interface MatchStatus {
  code: number;
  description: string;
  type: 'inprogress' | 'finished' | 'notstarted' | string;
}

export interface TimeInfo {
  currentPeriodStartTimestamp: number | null;
  initial: number;
  max: number;
  extra: number;
  injuryTime1?: number | null;
  injuryTime2?: number | null;
  periodLength?: number | null;
  overtimeLength?: number | null;
  totalPeriodCount?: number | null;
}

export interface StatusTime {
  prefix: string;
  initial: number;
  max: number;
  timestamp: number | null;
  extra: number;
}

export interface Features {
  hasGlobalHighlights: boolean;
  hasXg: boolean;
  hasEventPlayerStatistics: boolean;
  hasEventPlayerHeatMap: boolean;
  crowdsourcingDataDisplayEnabled: boolean;
  crowdsourcingEnabled: boolean;
  detailId: number | null;
}

export interface VarProgress {
  homeTeam: boolean;
  awayTeam: boolean;
}

export interface Changes {
  fields: string[];
  timestamp: number | null;
}

// Retained: tells client which SofaScore sub-resources are available
export interface EventFilters {
  category: string[];    // e.g. ["club"] ["national"]
  level: string[];       // e.g. ["top-competitions","pro","youth","contributor"]
  gender: string[];      // e.g. ["M"] ["F"]
}

export interface PreviousLeg {
  id: number;            // fetch previous leg: /api/v1/event/{id}
}

export interface Match {
  // --- Identity ---
  id: number;
  slug: string;
  startTimestamp: number;
  lastPeriod: string | null;
  finalResultOnly: boolean;
  feedLocked: boolean;
  isEditor: boolean;

  // --- Status ---
  status: MatchStatus;
  statusTime: StatusTime;

  // --- Time ---
  time: TimeInfo;

  // --- Tournament ---
  tournament: Tournament;

  // --- Teams ---
  home: Team;
  away: Team;

  // --- Features ---
  features: Features;

  // --- VAR ---
  var: VarProgress;

  // --- Changes ---
  changes: Changes;

  // --- SofaScore API reference keys ---
  filters: EventFilters;            // retained: route requests to correct SofaScore category/level
  previousLeg: PreviousLeg | null;  // retained: fetch first leg for two-legged ties
  aggregatedWinnerCode: number | null;
}

export interface PaginatedMatches {
  page: number;
  pageSize: number;
  total: number;
  matches: Match[];
}
