import type { ISportsProvider } from './provider.interface';

/**
 * Central registry for sports data providers (Strategy selector).
 *
 * Usage:
 *   registry.register(new SofaScoreProvider(), true);
 *   registry.register(new ApiFootballProvider());
 *
 *   const provider = registry.get('sofascore');
 *   const defaultProvider = registry.getDefault();
 */
class ProviderRegistry {
  private providers = new Map<string, ISportsProvider>();
  private defaultName: string | null = null;

  /**
   * Register a provider. Pass `isDefault = true` to make it the default.
   * The first registered provider automatically becomes the default.
   */
  register(provider: ISportsProvider, isDefault = false): void {
    this.providers.set(provider.name, provider);
    if (isDefault || this.defaultName === null) {
      this.defaultName = provider.name;
    }
    console.log(`[registry] Registered provider: ${provider.name}${isDefault ? ' (default)' : ''}`);
  }

  /**
   * Get a provider by name.
   * @throws if the provider is not registered.
   */
  get(name: string): ISportsProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(
        `Provider "${name}" not registered. Available: ${this.listNames().join(', ')}`,
      );
    }
    return provider;
  }

  /**
   * Get the default provider.
   * @throws if no providers are registered.
   */
  getDefault(): ISportsProvider {
    if (!this.defaultName) {
      throw new Error('No providers registered');
    }
    return this.get(this.defaultName);
  }

  /**
   * Set the default provider by name.
   */
  setDefault(name: string): void {
    if (!this.providers.has(name)) {
      throw new Error(`Cannot set default: provider "${name}" not registered`);
    }
    this.defaultName = name;
  }

  /** List all registered provider names. */
  listNames(): string[] {
    return Array.from(this.providers.keys());
  }

  /** Check if a provider is registered. */
  has(name: string): boolean {
    return this.providers.has(name);
  }
}

/** Singleton provider registry */
export const registry = new ProviderRegistry();
