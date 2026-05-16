import type { Match, EventGraph, ScheduledTournamentsPage, TrendingPlayer, NewsFeed, TopUniqueTournament, CountrySportPriority, TournamentSeason } from '../types';

// ─── Shared types ────────────────────────────────────────────────────────────

export type ImageType = 'team' | 'tournament' | 'category' | 'player' | 'manager';

export interface ImageResult {
  body: ArrayBuffer;
  contentType: string;
}

export interface TournamentRoundParams {
  tournamentId: string;
  seasonId: string;
  round: string;
  lang: string;
}

// ─── Provider contract ───────────────────────────────────────────────────────

/**
 * The core Strategy interface every sports data provider must implement.
 *
 * To integrate a new API (e.g. API-Football, SportRadar):
 * 1. Create a new directory under `providers/`
 * 2. Implement this interface (extend BaseProvider for free retry/dedup)
 * 3. Register the provider in `index.ts` via `registry.register()`
 */
export interface ISportsProvider {
  /** Unique identifier for this provider (e.g. 'sofascore', 'api-football') */
  readonly name: string;

  // ─── Events ───────────────────────────────────────────────────────
  getLiveEvents(lang: string): Promise<any[]>;
  getScheduledEvents(date: string, lang: string): Promise<any[]>;
  getTournamentRoundEvents(params: TournamentRoundParams): Promise<Match[]>;
  getEventGraph(eventId: string): Promise<import('../types').EventGraph>;
  getEventDetail(eventId: string): Promise<import('../types').EventDetail>;
  getEventIncidents(eventId: string): Promise<import('../types').Incident[]>;
  getEventBestPlayers(eventId: string): Promise<import('../types').BestPlayers>;
  getEventAiInsights(eventId: string, lang: string): Promise<import('../types').AiInsights>;
  getEventH2H(eventId: string): Promise<import('../types').HeadToHead>;
  getEventManagers(eventId: string): Promise<import('../types').Managers>;
  getEventTvChannels(eventId: string): Promise<Record<string, number[]>>;
  getEventHighlights(eventId: string): Promise<import('../types').Highlight[]>;
  getEventMediaSummary(eventId: string, country: string): Promise<import('../types').MediaSummary>;

  // ─── Images ───────────────────────────────────────────────────────
  getImageUrl(type: ImageType, id: string): string;
  fetchImage(type: ImageType, id: string): Promise<ImageResult>;

  // ─── Discover ─────────────────────────────────────────────────────
  getScheduledTournaments(sport: string, date: string, page: number): Promise<ScheduledTournamentsPage>;
  getTrendingPlayers(sport: string): Promise<TrendingPlayer[]>;
  getNewsFeed(lang: string, page: number, perPage: number): Promise<NewsFeed>;
  getFeaturedEvents(sport: string): Promise<Match[]>;
  getTopTournaments(countryCode: string, sport: string): Promise<TopUniqueTournament[]>;
  getCountrySportPriorities(countryCode: string): Promise<CountrySportPriority[]>;
  getTournamentSeasons(tournamentId: number): Promise<TournamentSeason[]>;
  
  // ─── League Details (Pass-through) ────────────────────────────────
  getLeagueData(path: string, lang?: string): Promise<unknown>;
}
