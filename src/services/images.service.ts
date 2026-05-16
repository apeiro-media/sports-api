import { registry } from '../providers/registry';
import { ProviderValidationError, ProviderUpstreamError } from '../providers/base.provider';
import type { ImageType, ImageResult } from '../providers/provider.interface';

export type { ImageResult };
export { ProviderValidationError, ProviderUpstreamError };

const VALID_IMAGE_TYPES: ImageType[] = ['team', 'tournament', 'category', 'player', 'manager'];

/**
 * Fetch an image from the active sports data provider.
 * @throws ProviderValidationError if the image type is invalid.
 * @throws ProviderUpstreamError if the upstream fetch fails.
 */
export async function getImage(type: string, id: string): Promise<ImageResult> {
  if (!VALID_IMAGE_TYPES.includes(type as ImageType)) {
    throw new ProviderValidationError('images', 'Invalid image type');
  }

  const provider = registry.getDefault();
  return provider.fetchImage(type as ImageType, id);
}
