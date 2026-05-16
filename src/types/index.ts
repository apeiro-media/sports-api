export * from './common';
export * from './team';
export * from './tournament';
export * from './match';
export * from './graph';
export * from './eventDetail';
export * from './scheduledTournament';
export * from './trendingPlayer';
export * from './news';
export * from './config';
export * from './teamDetail';

// ─── API response envelope ───────────────────────────────────────────────────

export interface ApiError {
  error: string;
  details?: string;
}
