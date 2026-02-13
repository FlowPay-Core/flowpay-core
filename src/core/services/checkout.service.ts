import { nanoid } from "../../utils/nanoid";
import type { Store, ChargeRecord } from "../store/store";
import type { ProviderRegistry } from "../../rails/registry";
import type { CreateChargeInput } from "../../rails/railAdapter";

export class CheckoutService {
    constructor(private store: Store, private registry: ProviderRegistry) { }

    async checkout(providerId: string, input: Omit<CreateChargeInput, "currency">) {
        const idempotencyKey = input.idempotencyKey;
        const existing = await this.store.getChargeByIdempotencyKey(idempotencyKey);
        if (existing) return existing;

        const adapter = this.registry.get(providerId);
        const created = await adapter.createCharge({ ...input, currency: "BRL" });

        const now = new Date().toISOString();
        const charge: ChargeRecord = {
            chargeId: `ch_${nanoid(16)}`,
            providerId,
            providerChargeId: created.providerChargeId,
            status: created.status,
            amountCents: input.amountCents,
            currency: "BRL",
            customerRef: input.customerRef,
            productRef: input.productRef,
            idempotencyKey,
            createdAt: now,
            updatedAt: now,
        };

        await this.store.createCharge(charge);
        return charge;
    }
}
