import { registry } from '../providers/registry';
import { computeEtag } from '../utils/cache';

export async function getEventDetail(eventId: string) {
  const provider = registry.getDefault();
  const payload = await provider.getEventDetail(eventId);
  return { payload, etag: computeEtag(payload) };
}

export async function getEventIncidents(eventId: string) {
  const provider = registry.getDefault();
  const payload = await provider.getEventIncidents(eventId);
  return { payload, etag: computeEtag(payload) };
}

export async function getEventBestPlayers(eventId: string) {
  const provider = registry.getDefault();
  const payload = await provider.getEventBestPlayers(eventId);
  return { payload, etag: computeEtag(payload) };
}

export async function getEventAiInsights(eventId: string, lang: string) {
  const provider = registry.getDefault();
  const payload = await provider.getEventAiInsights(eventId, lang);
  return { payload, etag: computeEtag(payload) };
}

export async function getEventH2H(eventId: string) {
  const provider = registry.getDefault();
  const payload = await provider.getEventH2H(eventId);
  return { payload, etag: computeEtag(payload) };
}

export async function getEventManagers(eventId: string) {
  const provider = registry.getDefault();
  const payload = await provider.getEventManagers(eventId);
  return { payload, etag: computeEtag(payload) };
}

export async function getEventTvChannels(eventId: string) {
  const provider = registry.getDefault();
  const payload = await provider.getEventTvChannels(eventId);
  return { payload, etag: computeEtag(payload) };
}

export async function getEventHighlights(eventId: string) {
  const provider = registry.getDefault();
  const payload = await provider.getEventHighlights(eventId);
  return { payload, etag: computeEtag(payload) };
}

export async function getEventMediaSummary(eventId: string, country: string) {
  const provider = registry.getDefault();
  const payload = await provider.getEventMediaSummary(eventId, country);
  return { payload, etag: computeEtag(payload) };
}
