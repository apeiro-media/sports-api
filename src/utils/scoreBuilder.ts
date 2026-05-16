import { Score } from '../types/common';

export function buildScore(raw: any): Score {
  return {
    current:    raw?.current    ?? 0,
    display:    raw?.display    ?? 0,
    period1:    raw?.period1    ?? null,
    period2:    raw?.period2    ?? null,
    normaltime: raw?.normaltime ?? null,
    overtime:   raw?.overtime   ?? null,
    penalties:  raw?.penalties  ?? null,
    aggregated: raw?.aggregated ?? null,
  };
}
