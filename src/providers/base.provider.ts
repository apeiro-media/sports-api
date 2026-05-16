import type {
  ISportsProvider,
  ImageType,
  ImageResult,
  TournamentRoundParams,
} from './provider.interface';
import type { Match, EventGraph } from '../types';

// ─── Fetch options ───────────────────────────────────────────────────────────

export interface FetchOptions {
  headers?: Record<string, string>;
  timeoutMs?: number;
  maxRetries?: number;
  /** If true, attempts HTTP before HTTPS to bypass TLS-based WAF */
  bypassHttps?: boolean;
}

const DEFAULT_TIMEOUT_MS = 12_000;
const DEFAULT_MAX_RETRIES = 2;

// ─── Abstract base provider ─────────────────────────────────────────────────

/**
 * Abstract base class providing resilient HTTP fetching with:
 * - Request deduplication (prevents duplicate in-flight requests)
 * - Configurable retry with linear backoff
 * - HTTP/HTTPS bypass strategy for WAF circumvention
 * - Abort timeout
 *
 * Subclasses only implement data-shaping and URL logic.
 */
export abstract class BaseProvider implements ISportsProvider {
  abstract readonly name: string;

  private pendingRequests = new Map<string, Promise<unknown>>();

  // ─── Abstract methods subclasses must implement ─────────────────────
  abstract getLiveEvents(lang: string): Promise<any[]>;
  abstract getScheduledEvents(date: string, lang: string): Promise<any[]>;
  abstract getTournamentRoundEvents(params: TournamentRoundParams): Promise<Match[]>;
  abstract getEventGraph(eventId: string): Promise<EventGraph>;
  abstract getEventDetail(eventId: string): Promise<import('../types').EventDetail>;
  abstract getEventIncidents(eventId: string): Promise<import('../types').Incident[]>;
  abstract getEventBestPlayers(eventId: string): Promise<import('../types').BestPlayers>;
  abstract getEventAiInsights(eventId: string, lang: string): Promise<import('../types').AiInsights>;
  abstract getEventH2H(eventId: string): Promise<import('../types').HeadToHead>;
  abstract getEventManagers(eventId: string): Promise<import('../types').Managers>;
  abstract getEventTvChannels(eventId: string): Promise<Record<string, number[]>>;
  abstract getEventHighlights(eventId: string): Promise<import('../types').Highlight[]>;
  abstract getEventMediaSummary(eventId: string, country: string): Promise<import('../types').MediaSummary>;
  abstract getImageUrl(type: ImageType, id: string): string;
  abstract fetchImage(type: ImageType, id: string): Promise<ImageResult>;
  abstract getTournamentSeasons(tournamentId: number): Promise<import('../types').TournamentSeason[]>;
  abstract getLeagueData(path: string, lang?: string): Promise<unknown>;

  // ─── Shared resilient JSON fetch ────────────────────────────────────

  /**
   * Fetch JSON with request deduplication, retry, and optional HTTP bypass.
   */
  protected async fetchJson(url: string, opts: FetchOptions = {}): Promise<unknown> {
    const cacheKey = `${this.name}:${url}`;

    const existing = this.pendingRequests.get(cacheKey);
    if (existing) return existing;

    const promise = this.doFetchJson(url, opts);
    this.pendingRequests.set(cacheKey, promise);
    try {
      return await promise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  // ─── Shared resilient binary fetch ──────────────────────────────────

  /**
   * Fetch binary data (images, etc.) with HTTP bypass and timeout.
   */
  protected async fetchBinary(
    url: string,
    headers: Record<string, string>,
    timeoutMs = 8000,
  ): Promise<ImageResult> {
    // Strategy 1: HTTP bypass
    try {
      const httpUrl = url.replace('https://', 'http://');
      const res = await fetch(httpUrl, {
        headers,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.ok) {
        return {
          body: await res.arrayBuffer(),
          contentType: res.headers.get('content-type') || 'image/png',
        };
      }
    } catch {
      // HTTP bypass failed, fall through to HTTPS
    }

    // Strategy 2: HTTPS direct
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.ok) {
      return {
        body: await res.arrayBuffer(),
        contentType: res.headers.get('content-type') || 'image/png',
      };
    }

    throw new ProviderUpstreamError(this.name, res.status);
  }

  // ─── Private ────────────────────────────────────────────────────────

  private async doFetchJson(url: string, opts: FetchOptions): Promise<unknown> {
    const {
      headers = {},
      timeoutMs = DEFAULT_TIMEOUT_MS,
      maxRetries = DEFAULT_MAX_RETRIES,
      bypassHttps = true,
    } = opts;

    let lastError: Error | null = null;

    // Strategy 1: HTTP bypass (skip TLS-based WAF fingerprinting)
    if (bypassHttps && url.startsWith('https://')) {
      const httpUrl = url.replace('https://', 'http://');
      try {
        const res = await fetch(httpUrl, {
          headers,
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && !(data as any).error) return data;
        }
      } catch (err) {
        console.warn(`[${this.name}] HTTP bypass failed for ${httpUrl}`);
      }
    }

    // Strategy 2: Direct fetch with retries
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await fetch(url, {
          headers,
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (!res.ok) throw new Error(`Upstream ${res.status}`);

        const data = await res.json();
        if (data && !(data as any).error) return data;
        throw new Error(`Upstream error object: ${JSON.stringify(data)}`);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        // Don't retry 4xx errors (except 408 timeout)
        if (lastError.message.includes('Upstream 4') && !lastError.message.includes('408')) break;
        if (attempt < maxRetries - 1) {
          await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        }
      }
    }

    throw lastError ?? new ProviderUpstreamError(this.name, 502);
  }
}

// ─── Shared error classes ────────────────────────────────────────────────────

export class ProviderUpstreamError extends Error {
  public readonly statusCode: number;
  public readonly providerName: string;

  constructor(providerName: string, statusCode: number) {
    super(`[${providerName}] Upstream returned ${statusCode}`);
    this.name = 'ProviderUpstreamError';
    this.providerName = providerName;
    this.statusCode = statusCode;
  }
}

export class ProviderValidationError extends Error {
  public readonly providerName: string;

  constructor(providerName: string, message: string) {
    super(`[${providerName}] ${message}`);
    this.name = 'ProviderValidationError';
    this.providerName = providerName;
  }
}
