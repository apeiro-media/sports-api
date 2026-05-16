// ─── SofaScore raw API types ─────────────────────────────────────────────────

export interface FieldTranslations {
  nameTranslation?: Record<string, string>;
  shortNameTranslation?: Record<string, string>;
}

export interface SofaCountry {
  name?: string;
  alpha2?: string;
  alpha3?: string;
}

export interface SofaTeamColors {
  primary?: string;
  secondary?: string;
  text?: string;
}

export interface SofaSubTeam {
  id?: number;
}

export interface SofaParentTeam {
  id?: number;
}

export interface SofaTeam {
  id?: number;
  name?: string;
  shortName?: string;
  nameCode?: string;
  national?: boolean;
  gender?: 'M' | 'F';
  userCount?: number;
  priority?: number;
  teamColors?: SofaTeamColors;
  country?: SofaCountry;
  parentTeam?: SofaParentTeam;
  subTeams?: SofaSubTeam[];
  fieldTranslations?: FieldTranslations;
}

export interface SofaCategory {
  id?: number;
  name?: string;
  flag?: string;
  country?: SofaCountry;
  fieldTranslations?: FieldTranslations;
}

export interface SofaUniqueTournament {
  id?: number;
  name?: string;
  userCount?: number;
  primaryColorHex?: string;
  secondaryColorHex?: string;
  hasEventPlayerStatistics?: boolean;
  displayInverseHomeAwayTeams?: boolean;
  hasPerformanceGraphFeature?: boolean;
  fieldTranslations?: FieldTranslations;
}

export interface SofaTournament {
  name?: string;
  priority?: number;
  isGroup?: boolean;
  groupName?: string;
  groupSign?: string;
  isLive?: boolean;
  uniqueTournament?: SofaUniqueTournament;
  category?: SofaCategory;
  fieldTranslations?: FieldTranslations;
}

export interface SofaSeason {
  id?: number;
  name?: string;
  year?: string;
}

export interface SofaRoundInfo {
  round?: number;
  name?: string;
  slug?: string;
  cupRoundType?: number;
}

export interface SofaMatchStatus {
  code?: number;
  description?: string;
  type?: string;
}

export interface SofaScore {
  current?: number;
  display?: number;
  period1?: number;
  period2?: number;
  normaltime?: number;
  overtime?: number;
  penalties?: number;
  aggregated?: number;
}

export interface SofaTime {
  played?: number;
  periodLength?: number;
  initial?: number;
  max?: number;
  extra?: number;
  currentPeriodStartTimestamp?: number;
  injuryTime1?: number;
  injuryTime2?: number;
  overtimeLength?: number;
  totalPeriodCount?: number;
}

export interface SofaStatusTime {
  prefix?: string;
  initial?: number;
  max?: number;
  timestamp?: number;
  extra?: number;
}

export interface SofaEventFilters {
  category?: string[];
  level?: string[];
  gender?: string[];
}

export interface SofaEvent {
  id: number;
  slug?: string;
  startTimestamp?: number;
  lastPeriod?: string;
  finalResultOnly?: boolean;
  feedLocked?: boolean;
  isEditor?: boolean;
  hasGlobalHighlights?: boolean;
  hasXg?: boolean;
  hasEventPlayerStatistics?: boolean;
  hasEventPlayerHeatMap?: boolean;
  crowdsourcingDataDisplayEnabled?: boolean;
  crowdsourcingEnabled?: boolean;
  detailId?: number;
  tournament?: SofaTournament;
  season?: SofaSeason;
  roundInfo?: SofaRoundInfo;
  cupMatchesInRound?: number;
  homeTeam?: SofaTeam;
  awayTeam?: SofaTeam;
  homeScore?: SofaScore;
  awayScore?: SofaScore;
  status?: SofaMatchStatus;
  statusTime?: SofaStatusTime;
  time?: SofaTime;
  var?: { homeTeam?: boolean; awayTeam?: boolean };
  changes?: { fields?: string[]; timestamp?: number };
  eventFilters?: SofaEventFilters;
  previousLegEventId?: number;
  aggregatedWinnerCode?: number;
}

// ─── Graph ───────────────────────────────────────────────────────────────────

export interface SofaGraphPoint {
  minute?: number;
  value?: number;
}

export interface SofaGraphResponse {
  graphPoints?: SofaGraphPoint[];
  periodTime?: number;
  overtimeLength?: number;
  periodCount?: number;
}

// ─── New endpoint raw response types ─────────────────────────────────────────

export interface SofaScheduledTournamentsResponse {
  scheduled: Array<{
    tournament?: { id?: number; name?: string; slug?: string; priority?: number };
    uniqueTournament?: {
      id?: number; name?: string; slug?: string; userCount?: number;
      primaryColorHex?: string; secondaryColorHex?: string;
      hasEventPlayerStatistics?: boolean;
      category?: { id?: number; name?: string; flag?: string; alpha2?: string };
    };
    /** timezone offset (seconds) → count */
    timezoneEventCount?: Record<string, number>;
  }>;
}

export interface SofaTrendingPlayerRaw {
  player?: {
    id?: number; name?: string; shortName?: string; slug?: string;
    position?: string; jerseyNumber?: string; height?: number;
    userCount?: number; dateOfBirthTimestamp?: number;
    proposedMarketValueRaw?: { value?: number; currency?: string };
  };
  team?: {
    id?: number; name?: string; shortName?: string; slug?: string; nameCode?: string;
    teamColors?: SofaTeamColors;
  };
  event?: SofaEvent;
  rating?: number;
  goals?: number | null;
  goalAssist?: number | null;
  minutesPlayed?: number;
  totalShots?: number | null;
  expectedGoals?: number | null;
  saves?: number | null;
  keeperSaveValue?: number | null;
}

export interface SofaTrendingPlayersResponse {
  topPlayers?: SofaTrendingPlayerRaw[];
}

export interface SofaNewsPostRaw {
  id?: number;
  slug?: string;
  date?: string;
  title?: string;
  excerpt?: string;
  imageUrl?: string;
  tags?: Array<{ id?: number; slug?: string; name?: string }>;
}

export interface SofaFeaturedEventsResponse {
  featuredEvents?: SofaEvent[];
}

export interface SofaTopTournamentsResponse {
  uniqueTournaments?: Array<{
    id?: number; name?: string; slug?: string;
    primaryColorHex?: string; secondaryColorHex?: string; userCount?: number;
    category?: { id?: number; name?: string; slug?: string; flag?: string };
  }>;
}

export interface SofaCountryPrioritiesResponse {
  countrySportPriorities?: Array<{
    country?: string;
    sport?: { id?: number; slug?: string; name?: string };
    position?: number;
  }>;
}

export interface SofaSeasonsResponse {
  seasons?: Array<{
    id?: number; name?: string; year?: string; editor?: boolean;
  }>;
}

// ─── Team raw types ───────────────────────────────────────────────────────────

export interface SofaVenue {
  id?: number;
  name?: string;
  city?: { name?: string };
  stadium?: { capacity?: number; name?: string };
  country?: SofaCountry;
}

export interface SofaManager {
  id?: number;
  name?: string;
  shortName?: string;
  country?: SofaCountry;
}

export interface SofaTeamDetail extends SofaTeam {
  foundationDateTimestamp?: number;
  venue?: SofaVenue;
  manager?: SofaManager;
}

export interface SofaPlayerEntry {
  player?: {
    id?: number;
    name?: string;
    shortName?: string;
    position?: string;
    jerseyNumber?: string;
    dateOfBirthTimestamp?: number;
    height?: number;
    country?: SofaCountry;
    fieldTranslations?: FieldTranslations;
  };
  marketValue?: number;
  marketValueCurrency?: string;
}

export interface SofaTransferEntry {
  id?: number;
  player?: { id?: number; name?: string };
  transferFrom?: { id?: number; name?: string };
  transferTo?: { id?: number; name?: string };
  fee?: number;
  feeDescription?: string;
  type?: string;
  transferDateTimestamp?: number;
}

export interface SofaAchievementEntry {
  id?: number;
  uniqueTournament?: { id?: number; name?: string };
  seasons?: Array<{ id?: number; name?: string; year?: string }>;
}
