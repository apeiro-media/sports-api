import type { Context } from 'hono';
import * as eventDetailService from '../services/eventDetail.service';

const validateId = (id: string) => /^\d+$/.test(id);

export async function eventDetailController(c: Context) {
  const eventId = c.req.param('eventId');
  if (!validateId(eventId)) return c.json({ error: 'Invalid event ID' }, 400);
  const result = await eventDetailService.getEventDetail(eventId);
  return c.json(result.payload, 200, {
    ETag: result.etag,
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
  });
}

export async function incidentsController(c: Context) {
  const eventId = c.req.param('eventId');
  if (!validateId(eventId)) return c.json({ error: 'Invalid event ID' }, 400);
  const result = await eventDetailService.getEventIncidents(eventId);
  return c.json(result.payload, 200, {
    ETag: result.etag,
    'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
  });
}

export async function bestPlayersController(c: Context) {
  const eventId = c.req.param('eventId');
  if (!validateId(eventId)) return c.json({ error: 'Invalid event ID' }, 400);
  const result = await eventDetailService.getEventBestPlayers(eventId);
  return c.json(result.payload, 200, {
    ETag: result.etag,
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
  });
}

export async function aiInsightsController(c: Context) {
  const eventId = c.req.param('eventId');
  const lang = c.req.param('lang');
  if (!validateId(eventId)) return c.json({ error: 'Invalid event ID' }, 400);
  const result = await eventDetailService.getEventAiInsights(eventId, lang);
  return c.json(result.payload, 200, {
    ETag: result.etag,
    'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240',
  });
}

export async function h2hController(c: Context) {
  const eventId = c.req.param('eventId');
  if (!validateId(eventId)) return c.json({ error: 'Invalid event ID' }, 400);
  const result = await eventDetailService.getEventH2H(eventId);
  return c.json(result.payload, 200, {
    ETag: result.etag,
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  });
}

export async function managersController(c: Context) {
  const eventId = c.req.param('eventId');
  if (!validateId(eventId)) return c.json({ error: 'Invalid event ID' }, 400);
  const result = await eventDetailService.getEventManagers(eventId);
  return c.json(result.payload, 200, {
    ETag: result.etag,
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  });
}

export async function tvChannelsController(c: Context) {
  const eventId = c.req.param('eventId');
  if (!validateId(eventId)) return c.json({ error: 'Invalid event ID' }, 400);
  const result = await eventDetailService.getEventTvChannels(eventId);
  return c.json(result.payload, 200, {
    ETag: result.etag,
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  });
}

export async function highlightsController(c: Context) {
  const eventId = c.req.param('eventId');
  if (!validateId(eventId)) return c.json({ error: 'Invalid event ID' }, 400);
  const result = await eventDetailService.getEventHighlights(eventId);
  return c.json(result.payload, 200, {
    ETag: result.etag,
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
  });
}

export async function mediaSummaryController(c: Context) {
  const eventId = c.req.param('eventId');
  const country = c.req.param('country');
  if (!validateId(eventId)) return c.json({ error: 'Invalid event ID' }, 400);
  const result = await eventDetailService.getEventMediaSummary(eventId, country);
  return c.json(result.payload, 200, {
    ETag: result.etag,
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
  });
}
