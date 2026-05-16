import { registry } from '../providers/registry';
import { computeEtag } from '../utils/cache';
import type {
  ScheduledTournamentsPage,
  TrendingPlayer,
  NewsFeed,
  Match,
  TopUniqueTournament,
  CountrySportPriority,
  TournamentSeason,
} from '../types';

// ─── Result wrappers ─────────────────────────────────────────────────────────

export interface DiscoverResult<T> {
  payload: T;
  etag: string;
  updatedAt: number;
}

function buildResult<T>(payload: T): DiscoverResult<T> {
  return { payload, etag: computeEtag(payload), updatedAt: Date.now() };
}

// ─── Scheduled Tournaments ───────────────────────────────────────────────────

export async function getScheduledTournaments(
  sport: string,
  date: string,
  page: number,
): Promise<DiscoverResult<ScheduledTournamentsPage>> {
  const provider = registry.getDefault();
  const payload = await provider.getScheduledTournaments(sport, date, page);
  return buildResult(payload);
}

// ─── Trending Players ────────────────────────────────────────────────────────

export async function getTrendingPlayers(
  sport: string,
): Promise<DiscoverResult<TrendingPlayer[]>> {
  const provider = registry.getDefault();
  const payload = await provider.getTrendingPlayers(sport);
  return buildResult(payload);
}

// ─── News Feed ───────────────────────────────────────────────────────────────

export async function getNewsFeed(
  lang: string,
  page: number,
  perPage: number,
): Promise<DiscoverResult<NewsFeed>> {
  const provider = registry.getDefault();
  const payload = await provider.getNewsFeed(lang, page, perPage);
  return buildResult(payload);
}

// ─── Featured Events ─────────────────────────────────────────────────────────

export async function getFeaturedEvents(
  sport: string,
): Promise<DiscoverResult<Match[]>> {
  const provider = registry.getDefault();
  const payload = await provider.getFeaturedEvents(sport);
  return buildResult(payload);
}

// ─── Top Tournaments ─────────────────────────────────────────────────────────

export async function getTopTournaments(
  countryCode: string,
  sport: string,
): Promise<DiscoverResult<TopUniqueTournament[]>> {
  const provider = registry.getDefault();
  const payload = await provider.getTopTournaments(countryCode, sport);
  return buildResult(payload);
}

// ─── Country Sport Priorities ─────────────────────────────────────────────────

export async function getCountrySportPriorities(
  countryCode: string,
): Promise<DiscoverResult<CountrySportPriority[]>> {
  const provider = registry.getDefault();
  const payload = await provider.getCountrySportPriorities(countryCode);
  return buildResult(payload);
}

// ─── Tournament Seasons ───────────────────────────────────────────────────────

export async function getTournamentSeasons(
  tournamentId: number,
): Promise<DiscoverResult<TournamentSeason[]>> {
  const provider = registry.getDefault();
  const payload = await provider.getTournamentSeasons(tournamentId);
  return buildResult(payload);
}
