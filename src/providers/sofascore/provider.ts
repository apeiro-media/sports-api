import { BaseProvider, ProviderValidationError } from '../base.provider';
import type { ImageType, ImageResult, TournamentRoundParams } from '../provider.interface';
import type {
  EventGraph, Match,
  ScheduledTournamentsPage, TrendingPlayer, NewsFeed,
  TopUniqueTournament, CountrySportPriority, TournamentSeason,
} from '../../types';
import { BROWSER_HEADERS, IMAGE_ACCEPT } from '../../utils/headers';
import { transformMatch } from '../../transformers/matchTransformer';
import {
  transformEventDetail,
  transformIncidents,
  transformBestPlayers,
  transformAiInsights,
  transformH2H,
  transformManagers,
  transformTvChannels,
  transformHighlights,
  transformMediaSummary,
} from '../../transformers/eventDetailTransformer';
import { transformScheduledTournaments } from '../../transformers/scheduledTournamentTransformer';
import { transformTrendingPlayers } from '../../transformers/trendingPlayerTransformer';
import { transformNewsFeed } from '../../transformers/newsTransformer';
import {
  transformTopTournaments,
  transformCountrySportPriorities,
  transformTournamentSeasons,
} from '../../transformers/configTransformer';
import type {
  SofaGraphResponse,
  SofaScheduledTournamentsResponse,
  SofaTrendingPlayersResponse,
  SofaNewsPostRaw,
  SofaFeaturedEventsResponse,
  SofaTopTournamentsResponse,
  SofaCountryPrioritiesResponse,
  SofaSeasonsResponse,
} from './types';

const SOFASCORE_API = 'https://www.sofascore.com/api/v1';
const SOFASCORE_IMG = 'https://img.sofascore.com/api/v1';

const IMAGE_PATHS: Record<ImageType, string> = {
  team: 'team',
  tournament: 'unique-tournament',
  category: 'category',
  player: 'player',
  manager: 'manager',
};

/**
 * Football data provider.
 *
 * Implements the ISportsProvider strategy for fetching football events
 * and images from the upstream API.
 */
export class FootballProvider extends BaseProvider {
  readonly name = 'football';

  private buildHeaders(lang: string): Record<string, string> {
    return {
      ...BROWSER_HEADERS,
      'Accept-Language': `${lang},en;q=0.9`,
      'X-Sofa-Client': 'web',
    };
  }

  // ─── Events ───────────────────────────────────────────────────────

  async getLiveEvents(lang: string): Promise<any[]> {
    const cleanLang = this.cleanLang(lang);
    const data = await this.fetchJson(
      `${SOFASCORE_API}/sport/football/events/live`,
      { headers: this.buildHeaders(cleanLang) },
    );
    return this.rawEvents(data);
  }

  async getScheduledEvents(date: string, lang: string): Promise<any[]> {
    const cleanLang = this.cleanLang(lang);
    const data = await this.fetchJson(
      `${SOFASCORE_API}/sport/football/scheduled-events/${date}`,
      { headers: this.buildHeaders(cleanLang) },
    );
    return this.rawEvents(data);
  }

  async getTournamentRoundEvents(params: TournamentRoundParams): Promise<Match[]> {
    const { tournamentId, seasonId, round, lang } = params;
    const cleanLang = this.cleanLang(lang);
    const data = await this.fetchJson(
      `${SOFASCORE_API}/unique-tournament/${tournamentId}/season/${seasonId}/events/round/${round}`,
      { headers: this.buildHeaders(cleanLang) },
    );
    return this.transform(data);
  }

  async getEventGraph(eventId: string): Promise<EventGraph> {
    const data = await this.fetchJson(
      `${SOFASCORE_API}/event/${eventId}/graph`,
      { headers: this.buildHeaders('en') },
    ) as SofaGraphResponse;

    return {
      graphPoints: (data.graphPoints ?? []).map(p => ({
        minute: p.minute ?? 0,
        value: p.value ?? 0,
      })),
      periodTime: data.periodTime ?? 45,
      overtimeLength: data.overtimeLength ?? 15,
      periodCount: data.periodCount ?? 2,
    };
  }

  async getEventDetail(eventId: string) {
    const raw = await this.fetchJson(`${SOFASCORE_API}/event/${eventId}`, { headers: this.buildHeaders('en') });
    return transformEventDetail(raw);
  }

  async getEventIncidents(eventId: string) {
    const raw = await this.fetchJson(`${SOFASCORE_API}/event/${eventId}/incidents`, { headers: this.buildHeaders('en') });
    return transformIncidents(raw);
  }

  async getEventBestPlayers(eventId: string) {
    const raw = await this.fetchJson(`${SOFASCORE_API}/event/${eventId}/best-players/summary`, { headers: this.buildHeaders('en') });
    return transformBestPlayers(raw);
  }

  async getEventAiInsights(eventId: string, lang: string) {
    const raw = await this.fetchJson(`${SOFASCORE_API}/event/${eventId}/ai-insights-postmatch/${lang}`, { headers: this.buildHeaders('en') });
    return transformAiInsights(raw);
  }

  async getEventH2H(eventId: string) {
    const raw = await this.fetchJson(`${SOFASCORE_API}/event/${eventId}/h2h`, { headers: this.buildHeaders('en') });
    return transformH2H(raw);
  }

  async getEventManagers(eventId: string) {
    const raw = await this.fetchJson(`${SOFASCORE_API}/event/${eventId}/managers`, { headers: this.buildHeaders('en') });
    return transformManagers(raw);
  }

  async getEventTvChannels(eventId: string) {
    const raw = await this.fetchJson(`${SOFASCORE_API}/tv/event/${eventId}/country-channels`, { headers: this.buildHeaders('en') });
    return transformTvChannels(raw);
  }

  async getEventHighlights(eventId: string) {
    const raw = await this.fetchJson(`${SOFASCORE_API}/event/${eventId}/highlights`, { headers: this.buildHeaders('en') });
    return transformHighlights(raw);
  }

  async getEventMediaSummary(eventId: string, country: string) {
    const raw = await this.fetchJson(`${SOFASCORE_API}/event/${eventId}/media/summary/country/${country}`, { headers: this.buildHeaders('en') });
    return transformMediaSummary(raw);
  }

  private transform(data: unknown): Match[] {
    if (data && typeof data === 'object' && ('error' in data || ('message' in data && (data as any).message === 'Forbidden'))) {
      throw new Error(`Upstream error: ${JSON.stringify(data)}`);
    }
    const events = (data as { events?: any[] })?.events ?? [];
    return events.map(transformMatch);
  }

  private rawEvents(data: unknown): any[] {
    if (data && typeof data === 'object' && ('error' in data || ('message' in data && (data as any).message === 'Forbidden'))) {
      throw new Error(`Upstream error: ${JSON.stringify(data)}`);
    }
    return (data as { events?: any[] })?.events ?? [];
  }

  // ─── Discover endpoints ───────────────────────────────────────────

  async getScheduledTournaments(sport: string, date: string, page: number): Promise<ScheduledTournamentsPage> {
    const data = await this.fetchJson<SofaScheduledTournamentsResponse>(
      `${SOFASCORE_API}/sport/${sport}/scheduled-tournaments/${date}/page/${page}`,
      { headers: this.buildHeaders('en') },
    );
    return transformScheduledTournaments(data.scheduled ?? [], page);
  }

  async getTrendingPlayers(sport: string): Promise<TrendingPlayer[]> {
    const data = await this.fetchJson<SofaTrendingPlayersResponse>(
      `${SOFASCORE_API}/sport/${sport}/trending-top-players`,
      { headers: this.buildHeaders('en') },
    );
    return transformTrendingPlayers(data.topPlayers ?? []);
  }

  async getNewsFeed(lang: string, page: number, perPage: number): Promise<NewsFeed> {
    const cleanLang = this.cleanLang(lang);
    const url = `${SOFASCORE_API}/sofascore-news/${cleanLang}/posts?page=${page}&per_page=${perPage}`;
    const data = await this.fetchJson<SofaNewsPostRaw[]>(url, { headers: this.buildHeaders(cleanLang) });
    // The news endpoint returns a raw array (no wrapper object)
    const rawArray = Array.isArray(data) ? data : [];
    return transformNewsFeed(rawArray, page, perPage);
  }

  async getFeaturedEvents(sport: string): Promise<Match[]> {
    const data = await this.fetchJson<SofaFeaturedEventsResponse>(
      `${SOFASCORE_API}/odds/1/featured-events-by-popularity/${sport}`,
      { headers: this.buildHeaders('en') },
    );
    return (data.featuredEvents ?? []).map(transformMatch);
  }

  async getTopTournaments(countryCode: string, sport: string): Promise<TopUniqueTournament[]> {
    const data = await this.fetchJson<SofaTopTournamentsResponse>(
      `${SOFASCORE_API}/config/top-unique-tournaments/${countryCode.toUpperCase()}/${sport}`,
      { headers: this.buildHeaders('en') },
    );
    return transformTopTournaments(data.uniqueTournaments);
  }

  async getCountrySportPriorities(countryCode: string): Promise<CountrySportPriority[]> {
    const data = await this.fetchJson<SofaCountryPrioritiesResponse>(
      `${SOFASCORE_API}/config/country-sport-priorities/country/${countryCode.toUpperCase()}`,
      { headers: this.buildHeaders('en') },
    );
    return transformCountrySportPriorities(data.countrySportPriorities);
  }

  async getTournamentSeasons(tournamentId: number): Promise<TournamentSeason[]> {
    const data = await this.fetchJson<SofaSeasonsResponse>(
      `${SOFASCORE_API}/unique-tournament/${tournamentId}/seasons`,
      { headers: this.buildHeaders('en') },
    );
    return transformTournamentSeasons(data.seasons);
  }

  // ─── League Details (Pass-through) ────────────────────────────────
  
  async getLeagueData(path: string, lang?: string): Promise<unknown> {
    const cleanLang = this.cleanLang(lang || 'en');
    const url = `${SOFASCORE_API}${path.startsWith('/') ? path : `/${path}`}`;
    return this.fetchJson(url, { headers: this.buildHeaders(cleanLang) });
  }

  // ─── Images ───────────────────────────────────────────────────────

  getImageUrl(type: ImageType, id: string): string {
    const path = IMAGE_PATHS[type];
    if (!path) {
      throw new ProviderValidationError(this.name, `Invalid image type: ${type}`);
    }
    return `${SOFASCORE_IMG}/${path}/${id}/image`;
  }

  async fetchImage(type: ImageType, id: string): Promise<ImageResult> {
    const url = this.getImageUrl(type, id);
    return this.fetchBinary(url, {
      'User-Agent': BROWSER_HEADERS['User-Agent'],
      'Accept': IMAGE_ACCEPT,
      'Referer': BROWSER_HEADERS['Referer'],
    });
  }

  // ─── Private ──────────────────────────────────────────────────────

  private cleanLang(lang: string): string {
    return lang.split(',')[0].split(';')[0].trim() || 'en';
  }
}
