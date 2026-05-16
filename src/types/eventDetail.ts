// ─── Event Detail ────────────────────────────────────────────────────────────

export interface EventDetail {
  id: number;
  slug: string;
  startTimestamp: number;
  status: { code: number; description: string; type: string };
  winnerCode: number;           // 1=home, 2=away, 3=draw
  homeScore: ScoreBreakdown;
  awayScore: ScoreBreakdown;
  venue: Venue | null;
  referee: Referee | null;
  hasXg: boolean;
  hasGlobalHighlights: boolean;
  defaultPeriodCount: number;
  defaultPeriodLength: number;
  roundInfo: { round: number; name: string } | null;
}

export interface ScoreBreakdown {
  current: number;
  display: number;
  period1?: number;
  period2?: number;
  normaltime?: number;
}

export interface Venue {
  name: string;
  city: string;
  capacity: number;
  country: string;
}

export interface Referee {
  name: string;
  yellowCards: number;
  redCards: number;
  games: number;
}

// ─── Incidents ───────────────────────────────────────────────────────────────

export type IncidentType = 'goal' | 'card' | 'substitution' | 'period' 
                         | 'injuryTime' | 'varDecision';

export interface Incident {
  id: number;
  incidentType: IncidentType;
  time: number;
  addedTime?: number;
  isHome: boolean;
  // Goal-specific
  incidentClass?: string;    // 'regular' | 'penalty' | 'ownGoal' | 'yellow' | 'red'
  playerName?: string;
  assistName?: string;
  homeScore?: number;
  awayScore?: number;
  // Card-specific
  reason?: string;           // 'Foul', 'Argument', etc.
  // Substitution-specific
  playerIn?: string;
  playerOut?: string;
  injury?: boolean;
  // Period
  text?: string;             // 'HT', 'FT'
  // Injury time
  length?: number;
}

// ─── Best Players ────────────────────────────────────────────────────────────

export interface PlayerRating {
  name: string;
  shortName: string;
  id: number;
  position: string;
  jerseyNumber: string;
  rating: string;             // e.g. "8.4"
}

export interface BestPlayers {
  bestHomeTeamPlayers: PlayerRating[];
  bestAwayTeamPlayers: PlayerRating[];
  playerOfTheMatch: PlayerRating | null;
}

// ─── AI Insights ─────────────────────────────────────────────────────────────

export interface AiInsightSection {
  subtitle: string;
  text: string;
}

export interface AiInsights {
  predictions: {
    yellowCards: number;
    corners: number;
    bothTeamsToScore: boolean;
    homeScore: number;
    awayScore: number;
    winProbability: { home: number; draw: number; away: number };
  };
  sections: AiInsightSection[];
  halftimeSections: AiInsightSection[];
}

// ─── Head-to-Head ────────────────────────────────────────────────────────────

export interface HeadToHead {
  homeWins: number;
  awayWins: number;
  draws: number;
}

// ─── Managers ────────────────────────────────────────────────────────────────

export interface Manager {
  name: string;
  shortName: string;
  id: number;
}

export interface Managers {
  home: Manager;
  away: Manager;
}

// ─── Highlights ──────────────────────────────────────────────────────────────

export interface Highlight {
  id: number;
  title: string;
  subtitle: string;
  url: string;
  thumbnailUrl?: string;
  sourceUrl: string;
  mediaType: number;          // 1=tweet/X, 6=youtube
  keyHighlight: boolean;
}

// ─── Media Summary ───────────────────────────────────────────────────────────

export interface MediaSummary {
  highlightedItem: Highlight | null;
  mediaItems: Highlight[];
  itemsCount: number;
}
