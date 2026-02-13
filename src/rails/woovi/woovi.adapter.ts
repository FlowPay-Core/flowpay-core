import type { RailAdapter, CreateChargeInput, CreateChargeOutput, ChargeStatus, VerifiedEvent } from "../railAdapter";
import { hmacSha256, timingSafeEqual } from "../../core/security/signatures";

export class WooviAdapter implements RailAdapter {
    readonly providerId = "woovi" as const;

    constructor(private cfg: { appId: string; apiKey: string; webhookSecret: string }) { }

    async createCharge(input: CreateChargeInput): Promise<CreateChargeOutput> {
        return {
            providerId: this.providerId,
            providerChargeId: "woovi_charge_id_here",
            status: "CREATED",
            checkoutUrl: "https://...",
            pixCopyPaste: "pix_payload_here",
        };
    }

    async getChargeStatus(providerChargeId: string): Promise<ChargeStatus> {
        return "PENDING";
    }

    async verifyWebhook(req: any, bodyRaw: Buffer): Promise<VerifiedEvent> {
        const headerSig = String(req.headers["x-webhook-signature"] ?? "");
        const expected = hmacSha256(this.cfg.webhookSecret, bodyRaw).toString("hex");
        const ok = timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(headerSig, "hex"));
        if (!ok) throw new Error("Invalid webhook signature");

        const parsed = JSON.parse(bodyRaw.toString("utf8"));
        return {
            providerId: this.providerId,
            eventId: parsed?.eventId ?? parsed?.charge?.correlationID ?? `woovi_${Date.now()}`,
            providerChargeId: parsed?.charge?.correlationID ?? parsed?.chargeId ?? "unknown",
            status: "PAID",
            paidAt: new Date().toISOString(),
            raw: parsed,
        };
    }
}
