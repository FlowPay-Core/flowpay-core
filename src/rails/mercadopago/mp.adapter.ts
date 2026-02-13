import type { RailAdapter, CreateChargeInput, CreateChargeOutput, ChargeStatus, VerifiedEvent } from "../railAdapter";
import { hmacSha256, timingSafeEqual } from "../../core/security/signatures";

export class MercadoPagoAdapter implements RailAdapter {
    readonly providerId = "mercadopago" as const;

    constructor(private cfg: { accessToken: string; webhookSecret: string }) { }

    async createCharge(input: CreateChargeInput): Promise<CreateChargeOutput> {
        // Mercado Pago: preference/payment with pix
        return {
            providerId: this.providerId,
            providerChargeId: "mp_payment_id_here",
            status: "CREATED",
            checkoutUrl: "https://...",
            pixCopyPaste: "pix_payload_here",
        };
    }

    async getChargeStatus(providerChargeId: string): Promise<ChargeStatus> {
        return "PENDING";
    }

    async verifyWebhook(req: any, bodyRaw: Buffer): Promise<VerifiedEvent> {
        // MP: valida headers/secret conforme docs; skeleton genérico:
        const headerSig = String(req.headers["x-signature"] ?? "");
        const expected = hmacSha256(this.cfg.webhookSecret, bodyRaw).toString("hex");
        const ok = timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(headerSig, "hex"));
        if (!ok) throw new Error("Invalid webhook signature");

        const parsed = JSON.parse(bodyRaw.toString("utf8"));
        return {
            providerId: this.providerId,
            eventId: parsed?.id ?? `mp_${Date.now()}`,
            providerChargeId: String(parsed?.data?.id ?? parsed?.payment_id ?? "unknown"),
            status: "PAID",
            paidAt: new Date().toISOString(),
            raw: parsed,
        };
    }
}
