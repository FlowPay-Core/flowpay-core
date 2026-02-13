import type { RailAdapter, ProviderId } from "./railAdapter";

export class ProviderRegistry {
    private map = new Map<ProviderId, RailAdapter>();

    register(adapter: RailAdapter) {
        if (this.map.has(adapter.providerId)) {
            throw new Error(`Provider already registered: ${adapter.providerId}`);
        }
        this.map.set(adapter.providerId, adapter);
    }

    get(providerId: ProviderId): RailAdapter {
        const adapter = this.map.get(providerId);
        if (!adapter) throw new Error(`Unknown provider: ${providerId}`);
        return adapter;
    }

    list(): ProviderId[] {
        return Array.from(this.map.keys());
    }
}
