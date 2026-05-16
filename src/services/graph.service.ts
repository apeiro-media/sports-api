import { registry } from '../providers/registry';
import { computeEtag } from '../utils/cache';
import type { EventGraph } from '../types';

export interface GraphResult {
  payload: EventGraph;
  etag: string;
}

export async function getEventGraph(eventId: string): Promise<GraphResult> {
  const provider = registry.getDefault();
  const payload = await provider.getEventGraph(eventId);
  const etag = computeEtag(payload);
  return { payload, etag };
}
