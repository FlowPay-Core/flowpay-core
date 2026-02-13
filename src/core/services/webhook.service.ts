import type { Store } from "../store/store";
import type { ProviderRegistry } from "../../rails/registry";
import { canTransition } from "../domain/stateMachine";

export class WebhookService {
    constructor(private store: Store, private registry: ProviderRegistry) { }

    async handle(providerId: string, req: any, bodyRaw: Buffer) {
        const adapter = this.registry.get(providerId);
        const ev = await adapter.verifyWebhook(req, bodyRaw);

        // Replay protection
        const seen = await this.store.hasEventProcessed(providerId, ev.eventId);
        if (seen) return { ok: true, replay: true };

        const charge = await this.store.getChargeByProviderChargeId(providerId, ev.providerChargeId);
        if (!charge) throw new Error("Charge not found for providerChargeId");

        if (!canTransition(charge.status, ev.status)) {
            // strict: do not update to illegal state
            await this.store.markEventProcessed(providerId, ev.eventId);
            return { ok: true, ignored: true, reason: "illegal_transition" };
        }

        await this.store.updateChargeStatus(charge.chargeId, ev.status, ev.paidAt);
        await this.store.markEventProcessed(providerId, ev.eventId);

        return { ok: true, status: ev.status, chargeId: charge.chargeId };
    }
}
