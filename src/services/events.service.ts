import { registry } from '../providers/registry';
import { computeEtag } from '../utils/cache';
import type { Match } from '../types';

export interface EventsResult<T = Match> {
  payload: T[];
  etag: string;
  updatedAt: number;
}

/**
 * Fetch raw live football events from the active provider (pass-through).
 */
export async function getLiveEvents(lang: string): Promise<EventsResult<any>> {
  const provider = registry.getDefault();
  const payload = await provider.getLiveEvents(lang);
  return buildResult(payload);
}

/**
 * Fetch raw scheduled events for a given date (pass-through).
 */
export async function getScheduledEvents(date: string, lang: string): Promise<EventsResult<any>> {
  const provider = registry.getDefault();
  const payload = await provider.getScheduledEvents(date, lang);
  return buildResult(payload);
}

/**
 * Fetch and shape events for a specific tournament round.
 */
export async function getTournamentRoundEvents(
  tournamentId: string,
  seasonId: string,
  round: string,
  lang: string,
): Promise<EventsResult> {
  const provider = registry.getDefault();
  const payload = await provider.getTournamentRoundEvents({
    tournamentId, seasonId, round, lang,
  });
  return buildResult(payload);
}

// ─── Internal helper ─────────────────────────────────────────────────────────

function buildResult<T>(payload: T[]): EventsResult<T> {
  const etag = computeEtag(payload);
  return { payload, etag, updatedAt: Date.now() };
}
